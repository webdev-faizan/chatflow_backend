import userModels from "../../models/userModels.js";

const friendConnectedUsersController = async (req, resp) => {
  try {
    const userFriend = await userModels
      .findById(req.user)
      .populate("friends", "_id email fullname status");
    return resp.json({
      message: "successfully found friends",
      data: userFriend.friends,
    });
  } catch (error) {
    console.log(error);
    return resp.json({ message: "internal server error" }).status(500);
  }
};

export default friendConnectedUsersController;
