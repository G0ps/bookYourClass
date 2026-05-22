import jwtService from "../services/jwt_service.js";

const jwtAutoLoginAttempt = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    // No token -> continue normally
    if (!token) {
      req.user = null;

      return next();
    }

    const decoded = await jwtService.verifyToken(token);

    // Invalid token -> clear and continue
    if (!decoded) {
      res.clearCookie("token");

      req.user = null;

      return next();
    }

    // Valid token
    req.user = decoded;

    req.isAuthenticated = true;

    next();
  } catch (error) {
    res.clearCookie("token");

    req.user = null;

    next();
  }
};

export default jwtAutoLoginAttempt;