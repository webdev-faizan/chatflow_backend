import Jwt from "jsonwebtoken";
import userModels from "../../models/userModels.js";
const signUpController = async (req, resp) => {
  try {
    const { fullname, email, password } = req.body;
    const existing_user = await userModels.findOne({ email });
    if (!existing_user) {
      const new_user = await new userModels({
        fullname,
        email,
        password,
      });
      await new_user.save();
      const expiresIn = 10 * 60 * 1000;
      const token = Jwt.sign({ id: this_user._id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });
      const link = `${process.env.BASE_URL}/auth/verify-email?token=${token}`;
      const html = VerifedEmailMail(firstName + " " + lastName || "", link);
      await sendNodemailerMail({ to: email, subject: "Email Verified", html });
      return resp
        .status(201)
        .json({ message: "successfully register", status: "success" });
    } else {
      return resp.status(401).json({
        message: "email is already in use please login",
        status: "error",
      });
    }
  } catch (error) {
    return resp.status(500).json({ message: "Internal server Error" });
  }
};

export default signUpController;

export const EmailVerification = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: "Token is missing or invalid" });
    }
    const tokenInfo = Jwt.verify(token, process.env.JWT_SECRET);
    if (!tokenInfo || !tokenInfo.id) {
      return res.status(400).json({ message: "Token is invalid" });
    }
    const id = tokenInfo.id;
    const date = Date.now();
    const this_user = await userModels
      .findById(id)
      .where("optExpiryToken")
      .gt(date)
      .select("emailVerified optExpiryToken");

    if (!this_user) {
      return res
        .status(401)
        .json({ message: "Token has expired or is invalid" });
    }

    if (this_user.emailVerified) {
      return res.status(400).json({ message: "User is already verified" });
    }

    this_user.emailVerified = true;
    this_user.optExpiryToken = undefined;
    await this_user.save();

    return res
      .status(200)
      .json({ message: "Email verification completed successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
