import jwt from "jsonwebtoken";

const genToken = (user, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    sameSite: "lax",
  });

  console.log("Generated Token:", token);
  console.log("User ID:", user._id);

  return token;
};

export default genToken;
