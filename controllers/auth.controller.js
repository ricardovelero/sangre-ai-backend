const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.user;

/**
 * @desc Inicia sesión y devuelve token + refreshToken
 * @route POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const token = jwt.sign({ id: user.id, email }, process.env.TOKEN_KEY, {
      expiresIn: "15m",
    });

    // Generar Refresh Token (expira en 7 días)
    const refreshToken = jwt.sign(
      { id: user.id },
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
 * @desc Registra nuevo usuario y devuelve token y refresh token
 * @route POST /api/auth/login
 */
const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email y contraseña son requeridos" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword });

    const token = jwt.sign({ id: user.id, email }, process.env.TOKEN_KEY, {
      expiresIn: "15m",
    });

    // Generar Refresh Token (expira en 7 días)
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_KEY,
      { expiresIn: "7d" }
    );

    // Guardar Refresh Token en la base de datos
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
    res.status(500).json({ message: "Error en el servidor", error });
  }
};

/**
 * @desc Obtener los datos del usuario autenticado
 * @route GET /api/auth/user
 */
const getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.userData.id, {
      attributes: ["id", "email"],
    });
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    res.json(user);
  } catch (error) {
    console.error("Error en getUser:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
};

/**
 * @desc Refresca el Access Token usando el Refresh Token
 * @route POST /api/auth/refresh
 */
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(403).json({ message: "Refresh Token es requerido" });
    }

    // Verificar si el Refresh Token existe en la BD
    const user = await User.findOne({ where: { refreshToken } });
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
        { id: user.id, email: user.email },
        process.env.TOKEN_KEY,
        { expiresIn: "15m" }
      );

      res.json({ token: newAccessToken });
    });
  } catch (err) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};

/**
 * @desc Cierra sesión eliminando el Refresh Token
 * @route POST /api/auth/logout
 */
const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh Token es requerido" });
    }

    // Buscar usuario con ese Refresh Token y eliminarlo
    const user = await User.findOne({ where: { refreshToken } });
    if (!user) {
      return res.status(400).json({ message: "Refresh Token inválido" });
    }

    user.refreshToken = null;
    await user.save();

    res.json({ message: "Cierre de sesión exitoso" });
  } catch (err) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};

module.exports = {
  login,
  logout,
  register,
  getUser,
  refreshToken,
};
