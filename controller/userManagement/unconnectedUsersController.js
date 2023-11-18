import userModels from "../../models/userModels.js";

const unconnectedUsersController = async (req, resp) => {
  try {
    const allUsers = await userModels
      .find({ verified: true })
      .select("friends fullname _id email status");
    const userId = await req.user;

    const userinfo = await userModels.findById(userId);

    const remaining_users = await allUsers.filter((user) => {
      return (
        userId != user._id &&
        !userinfo.friends.some(
          (allFriends) => allFriends._id.toString() == user._id.toString()
        )
      );
    });

    return resp.json({
      message: "successfully found users",
      data: remaining_users,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({ message: "Internal server error" });
  }
};
export default unconnectedUsersController;
