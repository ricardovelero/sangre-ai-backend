const User = require("../models/auth.model");

/**
 * @desc Obtener los datos del usuario autenticado
 * @route GET /api/auth/user
 */
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.userData.id).select(
      "_id email lastName firstName"
    );

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error en getUser:", error);
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

    // Optional: Require re-verification for email change
    // if (email && email !== req.userData.email) { ... }

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
    res.status(500).json({ message: "Error en el servidor" });
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

module.exports = {
  getUser,
  updateUser,
  deleteUser,
};
