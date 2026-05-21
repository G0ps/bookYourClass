import mongoose from "mongoose";

const venueSchema = new mongoose.Schema({

    name : {
        type  : String,
        required : true
    },
    block : {
        type : String,
        required : true
    },

    inchargeIds : {
        type : [mongoose.Schema.Types.ObjectId],
        ref : "Users"
    },


    capacity : {
        type : Number,
        required : true
    },


});

venueSchema.index(
    {name : 1 , block : 1},
    {unique : true}
)

export const venueModel = mongoose.model(
  "Venues",
  venueSchema,
  "Venues"
);