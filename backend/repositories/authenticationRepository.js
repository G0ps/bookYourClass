import mainModel from "./models/mainModel.js";

const userModel = mainModel.userModel

const insertNewUser = async (data) => {
    try{
        const new_user = new userModel(data);
        await new_user.save();
        return {status : "success" , new_user}
    }
    catch(error)
    {
        return {status : "error" , error};
    }
} 

const getUserByEmail = async (email) => {
  try {
    const user = await userModel.findOne({
      email,
    });

    return user;
  } 
  catch(error)
    {
        return {status : "error" , error};
    }
};

export default {insertNewUser , getUserByEmail}