import userModels from "../models/userModels.js";
import jwtDecodes from "../utils/jwtDecode.js";

const ProtectRoutes = async (req, resp, next) => {
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      const token = req.headers.authorization.split(" ")[1];
      const userInfo = await jwtDecodes(token);
      const existing_user = await userModels.findById({ _id: userInfo.id });
      if (existing_user) {
        req.user = existing_user.id;
        next();
      } else {
        return resp.status(403).json({ message: "User not found" });
      }
    } else {
      return resp.status(403).json({ message: "invalid token or expire" });
    }
  } catch (error) {
    return resp.status(5000).json({ message: "Internal server error" });
  }
};
export default ProtectRoutes;
