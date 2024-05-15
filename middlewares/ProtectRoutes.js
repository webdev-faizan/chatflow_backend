import userModels from "../models/userModels.js";
import jwtDecodes from "../utils/jwtDecode.js";

const ProtectRoutes = async (req, resp, next) => {
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      const token = req.headers.authorization.split(" ")[1];
      const existing_user = await userModels.findById({ _id: userInfo.id });
      const userInfo = Jwt.verify(token, process.env.JWT_SECRET);
      if (existing_user) {
        if (userInfo.iat > userInfo.passwordChangeAt) {
          req.user = existing_user.id;
          next();
        }
        resp.clearCookie("auth");
        resp.redirect("/login");
        return resp.status(401).json({ message: "Session is Expired" });
      } else {
        resp.clearCookie("auth");
        resp.redirect("/login");
        return resp.status(403).json({ message: "User not found" });
      }
    } else {
      resp.clearCookie("auth");
      resp.redirect("/login");
      return resp.status(403).json({ message: "invalid token or expire" });
    }
  } catch (error) {
    resp.clearCookie("auth");
    resp.redirect("/login");
    return resp.status(5000).json({ message: "Internal server error" });
  }
};
export default ProtectRoutes;
