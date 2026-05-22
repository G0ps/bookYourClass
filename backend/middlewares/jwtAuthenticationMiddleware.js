import jwtService from "../services/jwt_service.js";

const authenticationMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Token missing.",
      });
    }

    const decoded = await jwtService.verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Invalid token.",
      });
    }

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Authentication failed.",
    });
  }
};

export default authenticationMiddleware;