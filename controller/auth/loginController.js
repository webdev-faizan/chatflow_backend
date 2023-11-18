import userModels from "../../models/userModels.js";
import sessionTokenGenerator from "../../utils/jwtUtils.js";

const loginController = async (req, resp) => {
  const { email, password } = req.body;
  const user = await userModels.findOne({ email });
  const passwordss = await user.correctPassword(password, user.password);
  console.log(passwordss);

  // console.log(user);
  if (user) {
    const token = await sessionTokenGenerator(user._id);
    // console.loh(token)
    return resp.json({
      message: "Logged in successfully! ",
      token,
      status: "success",
      id: user._id,
    });
  } else {
    return resp
      .status(400)
      .json({ message: "email or password is incorrect", status: "error" });
  }
};

export default loginController;
