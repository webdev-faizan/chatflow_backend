import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
  },
  avatar: { type: String },
  email: { type: String },
  password: { type: String },
  passwordChangeAt: Date,
  passwordResetToken: String,
  passwordResetExpires: String,
  createdAt: String,
  updatedAt: String,
  verified: {
    type: Boolean,
    default: true,
  },

  otp: {
    type: String,
    default: null,
  },
  otpExpiryTime: Date,
  friends: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "user",
    },
    {
      type: mongoose.Schema.ObjectId,
      ref: "user",
    },
  ],
  socketId: {
    type: String,
  },
  status: {
    type: String,
    default: "offline",
    enum: ["online", "offline"],
  },
  conversationOpen: {
    type: Boolean,
  },
});


userSchema.pre("save", function (next) {
  if (!this?.isModified("otp")) next();

  this.otp = bcrypt.hashSync(this.otp, 8);

  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();

  this.password = bcrypt.hashSync(this.password);
  next();
});

userSchema.methods.correctPassword = async function (
  canditatepassword,
  userpassword
) {
  return bcrypt.compareSync(canditatepassword, userpassword);
};
userSchema.CreatePasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 + 1000 * 60;
  return resetToken;
};
// method check after issue token the user change password or not
userSchema.methods.changePasswordAfter = function (timestamp) {
  return timestamp > this.passwordChangeAt;
};
const userModels = new mongoose.model("user", userSchema);
export default userModels;
