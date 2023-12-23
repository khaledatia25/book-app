const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
exports.generateToken = (
  userId,
  username,
  email,
  fullname,
  userRoles,
  userTypeCode
) => {
  const token = jwt.sign(
    {
      userId,
      username,
      email,
      fullname,
      roles: userRoles,
      userTypeCode,
    },
    process.env.SECRET,
    { expiresIn: "3d" }
  );
  return token;
};

exports.verifyToken = async (roles) => {
  return async (req, res, next) => {
    try {
      const { token } = req.headers;
      if (!token) {
        return res.status(401).send({ error: "unauthorized access" });
      }
      const decoded = jwt.verify(token, process.env.SECRET);
      req.user = {
        userId: decoded.userId,
        username: decoded.username,
        email: decoded.email,
        fullname: decoded.fullname,
        roles: decoded.userRoles,
        userTypeCode: decoded.userTypeCode,
      };

      if (!this.hasRole(roles, decoded.userRoles)) {
        return res.status(401).send({ error: "auth failed" });
      }

      next();
    } catch (e) {
      next(e);
    }
  };
};

exports.hasRole = (routeRoles, userRoles) => {
  let result = false;
  userRoles.forEach((role) => {
    if (routeRoles.includes(role)) {
      result = true;
      return;
    }
  });
  return result;
};
