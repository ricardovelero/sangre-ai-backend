/**
 * @desc Crea un nuevo cliente
 * @route POST /api/clients
 * @access Privado (autenticación requerida)
 */
exports.upload = async (req, res, next) => {
  try {
    // Validar errores de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Verificar si el email ya existe
    const existingClient = await Client.findOne({
      where: { email: req.body.email },
    });
    if (existingClient) {
      return res
        .status(400)
        .json({ message: "Ya existe un cliente con este email." });
    }

    // Crear cliente
    const newClient = await Client.create(req.body);
    return res.status(201).json(newClient);
  } catch (err) {
    next(err); // Pasar el error al middleware de manejo de errores
  }
};
