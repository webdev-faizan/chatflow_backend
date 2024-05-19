import userModels from "../../models/userModels.js";

const userProileController = async (req, resp) => {
  try {
    console.log(req.query);
    const id = await req.user;
    await userModels.findByIdAndUpdate(id, {
      $set: { avatar: req.query.profileUrl },
    });
    return resp.status(200).json({ message: "Successfull change profile" });
  } catch (error) {
    return resp.status(500).json({ message: "Internal server error" });
  }
};
export default userProileController;
