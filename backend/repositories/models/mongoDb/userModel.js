import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    name : {
        type  : String,
        required : true
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },

    contactNumber: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true,
    },

    typeOfUser: {
        type: String,
        enum: ["student", "staff"],
        required: true,
    },
});

export const userModel = mongoose.model(
  "Users",
  userSchema,
  "Users"
);