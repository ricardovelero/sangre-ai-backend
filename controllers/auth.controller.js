const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/auth.model");
const { pmaEmail } = require("../utils/pmaEmail");
const htmlEmailRegistrationTemplate = require("../utils/htmlEmailRegistrationTemplate");
const { checkPasswordStrength } = require("../utils/passwordStrength");

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
      { expiresIn: "9d" }
    );

    // Guardar Refresh Token en la base de datos
    user.refreshToken = refreshToken;
    await user.save();

    // Only return safe user fields
    const safeUser = {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      // add other non-sensitive fields as needed
    };

    res.json({ message: "Login exitoso", token, refreshToken, user: safeUser });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "Error en el servidor" });
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
async function register(req, res) {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email y contraseña son requeridos" });
    }
    // Password strength check
    const strength = checkPasswordStrength(password);
    if (!strength.valid) {
      return res.status(400).json({ message: strength.message });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user (if email is unique, otherwise catch error)
    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    // Generate Access Token (valid for 3 days)
    const token = jwt.sign({ id: user._id, email }, process.env.TOKEN_KEY, {
      expiresIn: "3d",
    });

    // Generate Refresh Token (valid for 9 days)
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_KEY,
      {
        expiresIn: "9d",
      }
    );

    // Save Refresh Token in the database
    user.refreshToken = refreshToken;
    await user.save();

    const emailOptions = {
      from: "info@solucionesio.es",
      to: email,
      subject: "🩸¡Bienvenido a Sangre AI! 🆎",
      textBody:
        "Gracias por registrarte en Sangre AI. Estamos encantados de tenerte con nosotros.\n\nEmpieza ya a subir tus analíticas y recibir tus informes.\n\nUn saludo,\nEl equipo de soporte.",
      htmlBody: htmlEmailRegistrationTemplate,
      messageStream: "outbound",
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

    // Only return safe user fields
    const safeUser = {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      // add other non-sensitive fields as needed
    };

    res.status(201).json({
      message: "Usuario registrado con éxito",
      token,
      refreshToken,
      user: safeUser,
    });
  } catch (error) {
    console.error("Error en registro:", error);

    // Handle duplicate key error (MongoDB error code 11000)
    if (error.code === 11000 && error.keyPattern?.email) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    res.status(500).json({ message: "Error en el servidor" });
  }
}

/**
 * @desc Refresca el Access Token usando el Refresh Token
 * @route POST /api/auth/refresh
 * @param {string} req.body.refreshToken - The user's refresh
 * @returns {Promise<Object>} - A response object containing the status code and message
 * @throws {Error} If there is an issue with the API request or JSON parsing
 */
const refreshToken = async (req, res) => {
  try {
    const { refreshToken: refreshTokenValue } = req.body;
    if (!refreshTokenValue) {
      return res.status(403).json({ message: "Refresh Token es requerido" });
    }

    // Buscar usuario por Refresh Token (Mongoose syntax)
    const user = await User.findOne({ refreshToken: refreshTokenValue });

    if (!user) {
      return res.status(403).json({ message: "Refresh Token inválido" });
    }

    // Verificar si el Refresh Token es válido
    jwt.verify(
      refreshTokenValue,
      process.env.REFRESH_TOKEN_KEY,
      (err, _decoded) => {
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
      }
    );
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

module.exports = {
  login,
  logout,
  register,
  refreshToken,
  logoutAll,
};
