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
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return;
}

export default {assign_token};