
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
        type: String,
       
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
   
} 

)

const UserModel =mongoose.models.user || mongoose.model("user", userSchema)
export default UserModel;
