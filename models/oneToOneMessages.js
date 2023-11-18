import mongoose from "mongoose";

const oneToOneMessagesSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "user",
    },
  ],
  message: [
    {
      to: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
      },
      from: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
      },
      type: {
        type: String,
        enum: ["msg", "divider"],
      },
      subType: {
        type: String,
        enum: ["Text", "Media", "Link", "Document"],
      },
      fileName:{
        type:String
      },
      link: {
        type: String,
      },
      created_at: {
        type: String,
      },
      message: {
        type: String,
      },
      file: {
        type: String,
      },
    },
  ],
});

const OnetoOneMessageModel = new mongoose.model(
  "OneToOneMessage",
  oneToOneMessagesSchema
);

export default OnetoOneMessageModel;
