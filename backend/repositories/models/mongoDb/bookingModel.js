import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({

    venueId : {
        type : [mongoose.Schema.Types.ObjectId],
        required : true
    },
    staffId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
    // need cascading delete on bookings with user deletion

    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    // since it includes times no need for explicit time field

    status : {
        type : String,
        enum : ["pending" , "rejected" , "complete" , "invalid" , "canceled"],
        default : "pending",
        required : true
    }

});

bookingSchema.index({
    venueId : 1,
    startDate : 1,
    endDate : 1
})


export const bookingModel = mongoose.model(
  "bookings",
  bookingSchema,
  "bookings"
);
