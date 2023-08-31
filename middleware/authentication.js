import { UnauthenticatedError, Unauthorized } from "../errors/index.js";
import { isTokenValid } from "../utils/jwt.js";

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;
  if (!token) {
    throw new UnauthenticatedError("No Token Present!");
  }
  try {
    const { name, userId, role } = isTokenValid({ token });
    req.user = { name, userId, role };
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication InValid");
  }
};

const unauthorizedPermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new Unauthorized("Unauthorized to access this route");
    }
    next();
  };
};

export { authenticateUser, unauthorizedPermissions };