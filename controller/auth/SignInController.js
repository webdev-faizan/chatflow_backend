import userModels from "../../models/userModels.js";

const signInController = async (req, resp) => {
  try {
    const { fullname, email, password } = req.body;
    const existing_user = await userModels.findOne({ email });
    console.log(existing_user);

    if (existing_user && existing_user?.verified) {
      return resp.status(401).json({
        message: "email is already in use please login",
        status: "error",
      });
    } else if (existing_user && !existing_user.verified) {
      await userModels.findOneAndUpdate({ email }, req.body);
      return resp
        .status(401)
        .json({ message: "again successfully register", status: "success" });
    } else {
      const new_user = await new userModels({
        fullname,
        email,
        password,
      });

      await new_user.save();
      return resp
        .status(201)
        .json({ message: "successfully register", status: "success" });
    }
  } catch (error) {
    console.log(error);
    return resp.status(500).json(error);
  }
};

export default signInController;
