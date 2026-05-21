import authenticationRepository from "../repositories/authenticationRepository.js"

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

        return res.status(201).json(response);
    }
    catch(error)
    {
        return res.status(500).json({status : "error" , message : error.message});
    }
}