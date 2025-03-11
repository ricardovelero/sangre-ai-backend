const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.User;
const { pmaEmail } = require("../utils/pmaEmail");
const crypto = require("crypto");
const htmlEmailResetTemplate = require("../utils/htmlEmailResetTemplate");
/**
 * @desc Inicia sesión y devuelve token + refreshToken
 * @route POST /api/auth/login
 * @param {string} req.body.email - The user's email
 * @param {string} req.body.password - The user's password
 * @returns {Promise<Object>} - A response object containing the status code and message
 * @throws {Error} If there is an issue with the API request or JSON parsing
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const token = jwt.sign({ id: user._id, email }, process.env.TOKEN_KEY, {
      expiresIn: "3d",
    });

    // Generar Refresh Token (expira en 7 días)
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_KEY,
      { expiresIn: "7d" }
    );

    // Guardar Refresh Token en la base de datos
    user.refreshToken = refreshToken;
    await user.save();

    res.json({ message: "Login exitoso", token, refreshToken, user });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
};

/**
 * @desc Register a new user and return token & refresh token
 * @route POST /api/auth/register
 * @param {string} req.body.email - The user's email
 * @param {string} req.body.password - The user's password
 * @returns {Promise<Object>} - A response object containing the status code and message
 * @throws {Error} If there is an issue with the API request or JSON parsing
 */
const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email y contraseña son requeridos" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user (if email is unique, otherwise catch error)
    const user = await User.create({ email, password: hashedPassword });

    // Generate Access Token (valid for 15 minutes)
    const token = jwt.sign({ id: user._id, email }, process.env.TOKEN_KEY, {
      expiresIn: "3d",
    });

    // Generate Refresh Token (valid for 7 days)
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_KEY,
      {
        expiresIn: "7d",
      }
    );

    // Save Refresh Token in the database
    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({
      message: "Usuario registrado con éxito",
      token,
      refreshToken,
      user,
    });
  } catch (error) {
    console.error("Error en registro:", error);

    // Handle duplicate key error (MongoDB error code 11000)
    if (error.code === 11000 && error.keyPattern?.email) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    res.status(500).json({ message: "Error en el servidor", error });
  }
};

/**
 * @desc Obtener los datos del usuario autenticado
 * @route GET /api/auth/user
 */
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.userData.id).select("_id email");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error en getUser:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
};

/**
 * @desc Refresca el Access Token usando el Refresh Token
 * @route POST /api/auth/refresh
 * @param {string} req.body.refreshToken - The user's refresh
 * @returns {Promise<Object>} - A response object containing the status code and message
 * @throws {Error} If there is an issue with the API request or JSON parsing
 */
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(403).json({ message: "Refresh Token es requerido" });
    }

    // Buscar usuario por Refresh Token (Mongoose syntax)
    const user = await User.findOne({ refreshToken });

    if (!user) {
      return res.status(403).json({ message: "Refresh Token inválido" });
    }

    // Verificar si el Refresh Token es válido
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY, (err, decoded) => {
      if (err) {
        return res
          .status(403)
          .json({ message: "Refresh Token expirado o inválido" });
      }

      // Generar un nuevo Access Token
      const newAccessToken = jwt.sign(
        { id: user._id, email: user.email },
        process.env.TOKEN_KEY,
        { expiresIn: "3d" }
      );

      res.json({ token: newAccessToken });
    });
  } catch (err) {
    console.error("Error en refreshToken:", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

/**
 * @desc Cierra sesión eliminando el Refresh Token
 * @route POST /api/auth/logout
 * @param {string} req.body.refreshToken - The user's refresh token
 * @returns {Promise<Object>} - A response object containing the status code and message
 * @throws {Error} If there is an issue with the API request or JSON parsing
 */
const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh Token es requerido" });
    }

    // Buscar usuario y eliminar su Refresh Token
    const user = await User.findOneAndUpdate(
      { refreshToken },
      { $unset: { refreshToken: 1 } }, // Eliminar refreshToken
      { new: true }
    );

    if (!user) {
      return res.status(400).json({ message: "Refresh Token inválido" });
    }

    res.json({ message: "Cierre de sesión exitoso" });
  } catch (err) {
    console.error("Error en logout:", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

/**
 * @desc Actualiza infroamción del Usuario.
 * @route PUT /api/auth/user
 * @param {string} req.body.email - The user's email
 * @param {string} req.body.firstName - The user's first name
 * @param {string} req.body.lastName - The user's last name
 * @returns {Promise<Object>} - A response object containing the status code and message
 * @throws {Error} If there is an issue with the API request or JSON parsing
 */

const updateUser = async (req, res) => {
  try {
    const { email, firstName, lastName, phone } = req.body;

    // Find user and update fields
    const updatedUser = await User.findByIdAndUpdate(
      req.userData.id,
      { email, firstName, lastName, phone },
      { new: true, runValidators: true } // Returns updated user and validates input
    ).select("-password -refreshToken"); // Exclude password & refresh token from response

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario actualizado con éxito", user: updatedUser });
  } catch (error) {
    console.error("Error en updateUser:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
};

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
    res.status(500).json({ message: "Error en el servidor", error });
  }
};

/**
 * @desc Borra el usuario para siempre
 * @route DELETE /api/auth/user
 * @param {string} req.userData.id - The user ID from the JWT
 * @returns {Promise<Object>} - A response object containing the status code and message
 * @throws {Error} If there is an issue with the API request or JSON parsing
 */
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.userData.id);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    res.json({ message: "Cuenta eliminada exitosamente" });
  } catch (error) {
    console.error("Error en deleteUser:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

/**
 * @desc Salir de todas las sesiones
 * @route POST /api/auth/logout-all
 */
const logoutAll = async (req, res) => {
  try {
    // Remove all refresh tokens from the user
    await User.findByIdAndUpdate(req.userData.id, { refreshToken: null });

    res.json({ message: "Cierre de sesión en todos los dispositivos exitoso" });
  } catch (error) {
    console.error("Error en logoutAll:", error);
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

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
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
      from: "no-reply@example.com",
      to: user.email,
      subject: "Restablecimiento de contraseña",
      textBody: `Restablecimiento de contraseña\n\nHemos recibido una solicitud para restablecer tu contraseña.\n\nSi no hiciste esta solicitud, puedes ignorar este mensaje.\n\nPara cambiar tu contraseña, haz clic en el siguiente enlace:\n${resetUrl}\n\nEste enlace expirará en 15 minutos.\n\nSi tienes problemas, copia y pega el siguiente enlace en tu navegador:\n${resetUrl}\n\nGracias,\nEl equipo de soporte`,
      htmlBody,
    };

    // Send the email
    await pmaEmail({ body: JSON.stringify(emailOptions) });

    res.json({ message: "Correo de restablecimiento enviado con éxito" });
  } catch (error) {
    console.error("Error en forgotPassword:", error);
    res.status(500).json({ message: "Error en el servidor", error });
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
    res.status(500).json({ message: "Error en el servidor", error });
  }
};

module.exports = {
  login,
  logout,
  register,
  getUser,
  refreshToken,
  updateUser,
  updatePassword,
  deleteUser,
  logoutAll,
  forgotPassword,
  resetPassword,
};
