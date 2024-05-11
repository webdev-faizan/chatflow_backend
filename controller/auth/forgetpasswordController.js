import ResetPasswordMail from "../../templates/mail/ResetPasswordMail.js";
import sendNodemailerMail from "../../services/mail.js";
import userModels from "../../models/userModels.js";
const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);
    const is_user_register = await userModels
      .findOne({ email })
      .select("email");
    console.log(is_user_register);
    if (!is_user_register && !is_user_register?.verified) {
      return res.status(404).json({ message: "Account not exist" });
    } else {
      const token = await is_user_register.PasswordResetToken();
      await is_user_register.save();
      const link = `${process.env.BASE_URL}/auth/new-password?token=${token}`;
      const html = ResetPasswordMail(link, is_user_register.firstName);
      await sendNodemailerMail({ to: email, subject: "Forget Password", html });
      return res.json({
        message:
          "message: 'A password reset link has been sent to your email address!'s",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export default forgetPassword;
