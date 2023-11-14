import jwt from "jsonwebtoken"; //need payload to validate the token

const generateToken = (res, userId) => {
  //payload as userID
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  //ADMIN-USER-CHECK
  // const adminCode = process.env.ADMIN_CODE;
  // const token = adminCode + jwt.sign({ userId }, process.env.JWT_SECRET, {
  //   expiresIn: "30d",
  // });
  // console.log(token);
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development", //secure means-sites to be in "https"
    sameSite: "strict", //prevent CSRF ATTACKS
    maxAge: 30 * 24 * 60 * 60 * 1000, //when do this expire !important-value should be in seconds
  });
};

export default generateToken;
