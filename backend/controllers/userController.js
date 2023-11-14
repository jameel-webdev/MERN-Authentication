import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";
//@desc Auth-User/set-Token
//route POST /api/users/auth
//@access Public
const authUser = asyncHandler(async (req, res) => {
  //@example for error handling
  //   res.status(401);
  //   throw new Error(`Something went wrong`);
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  //User-EMAIL & PASSWORD-Check?
  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id); // Y?res-bcoz-we set the cookie with res.cookie@generateToken.js
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(401);
    throw new Error(`Invalid Email or Password`);
  }
});

//@desc Register a new user
//route POST /api/users
//@access Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  //Checking-EXSISTING USER
  const userExists = await User.findOne({ email });
  if (userExists) {
    //true
    throw new Error(`User already exists`);
  }
  //REGISTERATION
  const user = await User.create({
    name,
    email,
    password,
  });
  //REGISTRATION-Check?
  if (user) {
    generateToken(res, user._id); // Y?res-bcoz-we set the cookie with res.cookie@generateToken.js
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error(`Invalid User data`);
  }
});

//@desc Logout user
//route POST /api/users/logout
//@access Public
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "User Logged Out" });
});

//@desc GET user profile
//route GET /api/users/profile
//@access Private-token-needed
const getUserProfile = asyncHandler(async (req, res) => {
  /*ADMIN FUNCTIONALITY
  const user = await User.findById(req.user._id)
  */
  const user = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  };
  res.status(200).json({ user });
});

//@desc Update user profile
//route PUT /api/users/profile
//@access Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  //CHECK USER
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    //UPDATING PASSWORD
    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
  res.status(200).json({ message: "Update-User-Profile" });
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
};
// 401-client error
