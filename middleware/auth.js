const jwt = require("jsonwebtoken");

/* It checks if the token is valid and if it is, it decodes it and attaches the decoded token to the request object */
const verifyToken = (req, res, next) => {
  const token = String(req.headers.authorization)
    .replace(/^bearer|^jwt/i, "")
    .replace(/^\s+|\s+$/gi, "");

  try {
    /* Verifying the token. A missing header yields an invalid token string,
       so jwt.verify throws and we respond 401 below. */
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.userData = decoded;
  } catch (err) {
    return res.status(401).json({
      statusCode: 401,
      message: "Invalid Token",
    });
  }
  return next();
};

module.exports = verifyToken;
