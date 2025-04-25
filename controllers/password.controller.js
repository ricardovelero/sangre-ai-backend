const User = require("../models/auth.model");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { pmaEmail } = require("../utils/pmaEmail");
const htmlEmailResetTemplate = require("../utils/htmlEmailResetTemplate");
const { checkPasswordStrength } = require("../utils/passwordStrength");

/**
 * @desc Cambia contraseña de usuario
 * @route PUT /api/auth/user/password
 * @param {string} req.body.currentPassword - The user's current password
 * @param {string} req.body.newPassword - The user's new password to update
 * @returns {Promise<Object>} - A response object containing the status code and message
 * @throws {Error} If there is an issue with the API request or JSON parsing
 */
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Ambas contraseñas son requeridas" });
    }
    // Password strength check
    const strength = checkPasswordStrength(newPassword);
    if (!strength.valid) {
      return res.status(400).json({ message: strength.message });
    }

    // Find user
    const user = await User.findById(req.userData.id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "La contraseña actual es incorrecta" });
    }

    // Hash and update password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Contraseña actualizada con éxito" });
  } catch (error) {
    console.error("Error en updatePassword:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

/**
 * @desc Envía un enlace para restablecer contraseña via correo electronico
 * @route POST /api/auth/forgot-password
 * @param {string} event.body.email - The JSON stringified request body with email
 * @param {string} process.env.FRONTEND_URL - The frontend URL for the reset link
 * @returns {Promise<Object>} - A response object containing the status code and message
 * @throws {Error} If there is an issue with the API request or JSON parsing
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ message: "El correo electrónico es requerido" });
    }

    const user = await User.findOne({ email });
    // Always return success message to prevent email enumeration
    if (!user) {
      return res.json({
        message:
          "Si el correo existe, se ha enviado un enlace para restablecer la contraseña",
      });
    }

    // Generate a secure token (alternative to JWT)
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Encrypt the reset token before saving (optional security step)
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Store token & expiration in the user document
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = Date.now() + 15 * 60 * 1000; // 15 min expiry
    await user.save();

    // Construct reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Replace `{{reset_url}}` in email template
    const htmlBody = htmlEmailResetTemplate.replace(/{{reset_url}}/g, resetUrl);

    // Email content
    const emailOptions = {
      from: "info@solucionesio.es",
      to: user.email,
      subject: "🩸Restablecimiento de contraseña 🅾️",
      textBody: `Restablecimiento de contraseña\n\nHemos recibido una solicitud para restablecer tu contraseña.\n\nSi no hiciste esta solicitud, puedes ignorar este mensaje.\n\nPara cambiar tu contraseña, haz clic en el siguiente enlace:\n${resetUrl}\n\nEste enlace expirará en 15 minutos.\n\nSi tienes problemas, copia y pega el siguiente enlace en tu navegador:\n${resetUrl}\n\nGracias,\nEl equipo de soporte`,
      htmlBody,
    };

    // Send the email
    const emailResponse = await pmaEmail(emailOptions);
    if (emailResponse.statusCode >= 400) {
      // Log and send error response, then return to avoid sending another response later
      console.log(emailResponse);
      return res
        .status(emailResponse.statusCode)
        .json(JSON.parse(emailResponse.body));
    }

    res.json({
      message:
        "Si el correo existe, se ha enviado un enlace para restablecer la contraseña",
    });
  } catch (error) {
    console.error("Error en forgotPassword:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

/**
 * @desc Restablece la contraseña utilizando un token temporal
 * @route POST /api/auth/reset-password
 * @param {string} req.body.token - The reset token
 * @param {string} req.body.newPassword - The new password
 * @returns {Promise<Object>} - A response object containing the status code and message
 * @throws {Error} If there is an issue with the API request or JSON parsing
 */
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ message: "Token y nueva contraseña son requeridos" });
    }
    // Password strength check
    const strength = checkPasswordStrength(newPassword);
    if (!strength.valid) {
      return res.status(400).json({ message: strength.message });
    }

    // Hash the token (since we stored a hashed version in the DB)
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find the user by reset token and check if it’s still valid
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }, // Ensure token is not expired
    });

    if (!user) {
      return res.status(400).json({ message: "Token inválido o expirado" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password and remove reset token fields
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({ message: "Contraseña restablecida con éxito" });
  } catch (error) {
    console.error("Error en resetPassword:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

module.exports = {
  updatePassword,
  forgotPassword,
  resetPassword,
};
