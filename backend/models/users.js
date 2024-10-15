import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isStudent: { type: Number, required: true, default: true }, // year the student is doing the project
    isAdvisor: { type: Boolean, required: true, default: false },
    isCoordinator: { type: Boolean, required: true, default: false },
    interests : [{ type: String, required: false, default: "" }],
});

const userModel = mongoose.model("User", userSchema);
export default userModel;