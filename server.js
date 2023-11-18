import "dotenv/config";
import http from "http";
import app from "./app.js";
import mongoose from "mongoose";
import { Server } from "socket.io";
import { Cors } from "./config.js";
import userModels from "./models/userModels.js";
import jwtDecodes from "./utils/jwtDecode.js";
import friendModel from "./models/friendRequestModel.js";
import OnetoOneMessageModel from "./models/oneToOneMessages.js";
process.on("uncaughtException", (error) => {
  console.log(" uncaughtException", error);
  process.exit(0);
});

const server = http.createServer(app);
const Port = process.env.PORT || 8000;
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
  },
});
mongoose
  .connect(process.env.MONGOURI)
  .then((resp) => {
    console.log("successfully connected to the database");
  })
  .catch(() => {
    console.log("unable to establish connection to database");
  });
server.listen(Port, () => {
  console.log(`port is lissing ${Port}`);
});
// Listen for when the client connects via socket.io-client
io.on("connection", async (socket) => {
  const authToken = socket.handshake.query["user_token"];
  const socketId = socket.id;
  if (Boolean(authToken)) {
    try {
      const userInfo = await jwtDecodes(authToken);
      await userModels.findByIdAndUpdate(
        { _id: userInfo.id },
        { socketId, status: "online" }
      );
    } catch (error) {
      console.log(error);
    }
  }
  // //create friend request
  socket.on("friendRequest", async (data) => {
    const { to, from } = data;

    const userInfo = await jwtDecodes(from);

    const friendRequestAccept = await userModels.findById({ _id: to });
    const friendRequestSender = await userModels.findById({ _id: userInfo.id });

    await new friendModel({
      sender: friendRequestSender._id,
      recipeint: friendRequestAccept._id,
    }).save();
    //send confrimation notification to user friend request sent
    io.to(friendRequestSender.socketId).emit("friend_request_sent", {
      message: "friend request send",
    });
  });

  //friend request accepted

  socket.on("friend_request_accept", async (data) => {
    const { _id } = data;

    const isAlreadyUserFriend = await userModels
      .findOne({ _id })
      .select("fullname");
    if (!isAlreadyUserFriend) {
      socket.to(isAlreadyUserFriend?.socketId).emit("friend_request_accepted", {
        message: `${reciver?.fullname} has accepted your friend request.`,
      });
      return;
    }

    const request_doc = await friendModel.findOne({ sender: _id });
    const reciver = await userModels.findById(request_doc.recipeint);
    const sender = await userModels.findById(request_doc.sender);
    //add friends
    reciver.friends.push(sender._id);
    sender.friends.push(reciver._id);
    reciver.save();
    sender.save();

    //infom sender to xyz have friend request accepted

    socket.to(sender?.socketId).emit("friend_request_accepted", {
      message: `${reciver?.fullname} has accepted your friend request.`,
    });
    console.log("faizan");
    //infom successflly accepted friend request
    io.to(reciver?.socketId).emit("friend_request_accepted", {
      message: `🎉 You have a new friend: ${sender?.fullname}! Welcome them with open arms!`,
    });

    const res = await friendModel.deleteMany({ recipeint: reciver._id });
  });
  //get all chatlist
  socket.on("get_direct_conversions", async (data, callback) => {
    try {
      console.log("get direct conversons above");
      const { token } = data;
      const to = jwtDecodes(token).id;
      const diretConversions = await OnetoOneMessageModel.find({
        participants: { $all: [to] },
      }).populate("participants", "fullname status email _id");

      callback(diretConversions, to);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("start_conversion", async (data) => {
    try {
      const { token, from } = data;
      const to = jwtDecodes(token).id;
      const existing_conversations = await OnetoOneMessageModel.find({
        participants: { $size: 2, $all: [to, from] },
      }).populate("participants", "fullname");
      console.log(existing_conversations);
      if (existing_conversations.length == 0) {
        let new_chat = await OnetoOneMessageModel.create({
          participants: [to, from],
        });
        new_chat.save();
        new_chat = OnetoOneMessageModel.find({
          participants: { $size: 2, all: [to, from] },
        });
        socket.emit("start_chat", new_chat);
      } else {
        socket.emit("start_chat", existing_conversations[0]);
      }
    } catch (error) {
      console.log(error);
    }
  });
  //send user message when click on chat list
  socket.on("get_message", async (data, callback) => {
    const { conversions_id } = data;
    const chats = await OnetoOneMessageModel.findById(conversions_id);
    callback(chats.message);
  });

  //send text message

  socket.on("text_message", async (data) => {
    try {
      const { token, from, type, message, conversation_id, sender } = data;
      const chat = await OnetoOneMessageModel.findById(conversation_id);
      const to = jwtDecodes(token).id;
      const to_user = await userModels.findById(to);

      const from_user = await userModels.findById(from);
      const currentDate = new Date();

      const formattedTime = currentDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true, // Set to true to include AM/PM
      });
      const new_message = {
        to,
        from,
        type: "msg",
        message: message,
        created_at: `${Date()} + ${formattedTime}`,
      };
      console.log(formattedTime);
      chat.message.push(new_message);
      await chat.save();

      io.to(to_user?.socketId).emit("new_message", {
        message: new_message,
        conversation_id,
      });
      io.to(from_user?.socketId).emit("new_message", {
        message: new_message,
        conversation_id,
      });
    } catch (error) {
      console.log(error);
    }
  });
  //link message

  socket.on("link_message", async (data) => {
    try {
      console.log(data);
      const {
        token,
        from,
        subType,
        type,
        message,
        conversation_id,
        link,
        fileName,
      } = data;
      const chat = await OnetoOneMessageModel.findById(conversation_id);
      const to = jwtDecodes(token).id;
      const to_user = await userModels.findById(to);

      const from_user = await userModels.findById(from);
      const currentDate = new Date();

      const formattedTime = currentDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true, // Set to true to include AM/PM
      });
      const new_message = {
        to,
        from,
        type,
        subType: subType,
        fileName,
        link,
        message: message,
        created_at: `${Date()} + ${formattedTime}`,
      };
      chat.message.push(new_message);
      await chat.save();

      io.to(to_user?.socketId).emit("new_message", {
        message: new_message,
        conversation_id,
      });
      io.to(from_user?.socketId).emit("new_message", {
        message: new_message,
        conversation_id,
      });
    } catch (error) {
      console.log(error);
    }
  });

  io.on("end", async (data) => {
    console.log({ data, message: "user disconnected" });
    // const userInfo = data.userInfo;
    // await User.findByIdAndUpdate(data.user_id, { status: "Offline" });
    // socket.disconnect(0)
  });
  // We can write our socket event listeners in here...
});

process.on("unhandledRejection", () => {
  // console.log({ unhandledRejection });

  server.close(() => {
    process.exit(1);
  });
});
