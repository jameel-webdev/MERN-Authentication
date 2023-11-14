import jwt from "jsonwebtoken"; //used-bcoz v need payload from token-userID
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
//MIDDLEWARE TO PROTECT ROUTE
const protect = asyncHandler(async (req, res, next) => {
  let token;

  token = req.cookies.jwt; //tis can be done only by installing cookie-parser
  //CHECKING-TOKEN(cookie)
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); //decoded obj has userID
      //PROFILE AUTH BY USERID
      req.user = await User.findById(decoded.userId).select("-password"); //req.user anything is possible
      next();
    } catch (error) {
      res.status(401);
      throw new Error(`Not Authorized, Invalid Token`);
    }
  } else {
    res.status(401);
    throw new Error(`Not Authorized, No Token`);
  }
});
export { protect }; //y ? {} v can add other authmiddleware for admin

//ADMIN AUTHORIZATION
const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.Admin) {
    next();
  } else {
    res.status(401).send(`not authorized as admin`);
  }
};
