module.exports = (req, res, next) => {
  // Mock a valid MongoDB ObjectId and use req.userData to match the actual implementation
  req.userData = { id: "65f1e8afd91baac7eb38d5c" }; // Simular usuario autenticado
  next();
};
