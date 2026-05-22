import jwt from "jsonwebtoken";

const assign_token = (res , user) => {

    const token = jwt.sign(
        {
            userId: user._id,
            role: user.typeOfUser,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "2m",
        }
    );
    res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("role", user.typeOfUser, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return;
}

const verifyToken = async (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export default {assign_token , verifyToken,};