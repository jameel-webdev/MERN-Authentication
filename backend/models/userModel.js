import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

//PIECE OF MIDDLEWARE
//@desc .pre means before--no arrow functn--bcz of using this keyword
userSchema.pre("save", async function (next) {
  if (!this.isModified(`password`)) {
    // this meant `User.create`@(userController) || `User.save`
    next();
  }
  //HASHING PASSWORD
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//ORIGINAL PASSWORD RECHECK BEFORE LOGIN - UNDO HASHING
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
