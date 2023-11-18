const ForgetPassword = async (req, res) => {
  const user = user.findOne({ emai: req.body.email });

  const resetToken = await user.createPasswordResetToken();
  const resetURL = `https://faizan.com/auth/reset-password/?code=${resetToken}`;
  //   sent to the eamil
};

const resetPassword = async (req, resp) => {
  const hashToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await user.findOne({
    passwordResetToken: hashToken,
    passwordExpiresTime: { $gt: Date.now() },
  });

  if (!user) {
    resp.json({ message: "token is invalid or expired" });
  }
  user.password = req.body.password;
  passwordResetToken = undefined;
  passwordExpiresTime = undefined;
  await user.save();
};
