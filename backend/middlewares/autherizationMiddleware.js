const autherizationMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      const userRole = req.user?.role;

      if (!userRole) {
        return res.status(403).json({
          success: false,
          message: "Access denied.",
        });
      }

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized role.",
        });
      }

      next();
    } catch (error) {
      return res.status(403).json({
        success: false,
        message: "Authorization failed.",
      });
    }
  };
};

export default autherizationMiddleware;