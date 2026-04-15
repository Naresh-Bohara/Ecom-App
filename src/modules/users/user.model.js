import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: String,
    address: {
        country: { type: String, default: "Nepal" },
        company: String,
        street: { type: String, required: true },
        additional: String,
        postalCode: { type: String, required: true },
        city: String
    },
    billingAddress: {
        firstName: String,
        lastName: String,
        country: { type: String, default: "Nepal" },
        company: String,
        street: String,
        additional: String,
        postalCode: String,
        city: String
    },
    role: {
        type: String,
        enum: ['admin', 'customer'],
        default: "customer"
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: "inactive"
    },
    activationToken: String,
    forgetToken: String,
    expiryTime: Date
}, {
    timestamps: true
});

const UserModel = mongoose.model("User", UserSchema);
export default UserModel;