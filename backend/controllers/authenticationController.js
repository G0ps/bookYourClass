import authenticationRepository from "../repositories/authenticationRepository.js"

import jwt_service from "../services/jwt_service.js";

export const register = async (req , res) => {
    const {
        name,
        email,
        contactNumber,
        password,
        typeOfUser,
    } = req.body;

    const missing_fields = [];

    if (!name) missing_fields.push("name");
    if (!email) missing_fields.push("email");
    if (!contactNumber) missing_fields.push("contactNumber");
    if (!password) missing_fields.push("password");
    if (!typeOfUser) missing_fields.push("typeOfUser");

    if (missing_fields.length > 0) {
        return res.status(400).json({
            status: "Error",
            message: "Values missing",
            missing_fields,
        });
    }

    try{
        const response = await authenticationRepository.insertNewUser(
            {
                name,
                email,
                contactNumber,
                password,
                typeOfUser,
            }
        );

        if(response.status == "error")
        {
            throw response.error;
        }

        // assigning new token
        jwt_service.assign_token(res , response.new_user);

        return res.status(201).json({status : "success" , role : new_user.typeOfUser});
    }
    catch(error)
    {
        return res.status(500).json({status : "error" , message : error.message});
    }
}

export const login = async(req , res) => {
    if (req.isAuthenticated) {
        return res.status(200).json({
            success: true,
            message: "Already logged in",
            user: req.user,
        });
    }

    const {
        email,
        password
    } = req.body;

    const missing_fields = [];
    
    if (!email) missing_fields.push("email");
    if (!password) missing_fields.push("password");

    if (missing_fields.length > 0) {
        return res.status(400).json({
            status: "Error",
            message: "Values missing",
            missing_fields,
        });
    }

    try{
        const user = await authenticationRepository.getUserByEmail(email);

        if(!user)
        {
            throw new Error("user not found");
        }

        const correctPassword = user.password;

        if(password !== correctPassword)
        {
            throw new Error("password missmatched");
        }
        // assigning new token
        jwt_service.assign_token(res , user);

        return res.status(202).json({status : "success" , role : user.typeOfUser});

    }
    catch(error)
    {
        return res.status(500).json({status : "error" , message : error.message});
    }
}