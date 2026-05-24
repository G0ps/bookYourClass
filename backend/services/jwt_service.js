import jwt from "jsonwebtoken";

const assign_token = (res , user) => {

    const token = jwt.sign(
        {
            userId: user._id,
            role: user.typeOfUser,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "30m",
        }
    );
    res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("role", user.typeOfUser, {
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return;
}

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop().split(";").shift();
  }

  return null;
};



const verifyToken = async (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export default {assign_token , verifyToken,};