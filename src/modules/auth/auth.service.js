import FileUploadService from "../../services/cloudinary.service.js";
import bcrypt from "bcryptjs";
import { generateDateTime, generateRandomString } from "../../utilities/helpers.js";
import mailSvc from "../../services/mail.service.js";
import HttpResponseCode from "../../constants/http-status-code.contants.js";
import HttpResponse from "../../constants/response-status.contants.js";
import UserModel from "../users/user.model.js";

class AuthService {
    generateActivationOtp = () => {
        return {
            activationToken: generateRandomString(6).toUpperCase(),
            expiryTime: generateDateTime(5),
        };
    };
transformCreateUser = async (req) => {
    try {
        const data = req.body;
        const file = req.file;
        
        // Debug - see what's coming
        console.log("File received:", file);
        
        data.password = bcrypt.hashSync(data.password, 12);

        const formattedData = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password,
            phone: data.phone,
            address: {
                street: data.address?.street,
                postalCode: data.address?.postalCode,
                country: "Deutschland"
            },
            role: data.role || "customer",
            // Only upload if file exists
            image: file && file.buffer ? await FileUploadService.uploadFile(file.buffer, "/users") : null,
            status: "inactive",
            activationToken: generateRandomString(6).toUpperCase(),
            expiryTime: generateDateTime(5),
        };

        return formattedData;
    } catch (exception) {
        throw exception;
    }
};

    registerUser = async (data) => {
        try {
            const existingUser = await UserModel.findOne({ email: data.email });
            if (existingUser) {
                throw { status: HttpResponseCode.BAD_REQUEST, message: "Email already registered.", statusCode: HttpResponse.validationFailed };
            }

            const userObj = new UserModel(data);
            return await userObj.save();
        } catch (exception) {
            throw exception;
        }
    };

    sendActivationEmail = async (user) => {
        try {
            const msg = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
                <header style="text-align: center; padding-bottom: 10px; border-bottom: 1px solid #e0e0e0; margin-bottom: 20px;">
                    <h2 style="color: #333;">Welcome to Our Store!</h2>
                </header>
                
                <p style="font-size: 16px; color: #333;">Dear ${user.firstName} ${user.lastName},</p>
                
                <p style="font-size: 16px; color: #333; line-height: 1.6;">
                    Thank you for registering. Please activate your account using the OTP code below:
                </p>
                
                <div style="text-align: center; margin: 20px 0;">
                    <span style="display: inline-block; padding: 15px 30px; font-size: 18px; font-weight: bold; color: #ffffff; background-color: #ff4d4d; border-radius: 8px;">
                        ${user.activationToken}
                    </span>
                </div>
                
                <p style="font-size: 16px; color: #333; line-height: 1.6;">
                    <strong>Note:</strong> This code is valid for only 5 minutes.
                </p>
                
                <footer style="margin-top: 20px; text-align: center; border-top: 1px solid #e0e0e0; padding-top: 10px; color: #777;">
                    <p style="font-size: 14px;">Regards,<br>Team</p>
                </footer>
            </div>
            `;

            await mailSvc.sendEmail(user.email, "Activate Your Account", msg);
            return true;
        } catch (exception) {
            throw exception;
        }
    };

    reSendActivationEmail = async (user) => {
        try {
            const msg = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
                <header style="text-align: center; padding-bottom: 10px; border-bottom: 1px solid #e0e0e0; margin-bottom: 20px;">
                    <h2 style="color: #333;">New OTP Code</h2>
                </header>
                
                <p style="font-size: 16px; color: #333;">Dear ${user.name},</p>
                
                <p style="font-size: 16px; color: #333; line-height: 1.6;">
                    Here is your new OTP code to activate your account:
                </p>
        
                <div style="text-align: center; margin: 20px 0;">
                    <span style="display: inline-block; padding: 15px 30px; font-size: 18px; font-weight: bold; color: #ffffff; background-color: #ff4d4d; border-radius: 8px;">
                        ${user.otp}
                    </span>
                </div>
        
                <p style="font-size: 16px; color: #333; line-height: 1.6;">
                    <strong>Note:</strong> This code is valid for only 5 minutes.
                </p>
        
                <footer style="margin-top: 20px; text-align: center; border-top: 1px solid #e0e0e0; padding-top: 10px; color: #777;">
                    <p style="font-size: 14px;">Regards,<br>Team</p>
                </footer>
            </div>
            `;
            
            await mailSvc.sendEmail(user.email, "New Activation OTP Code", msg);
            return true;
        } catch (exception) {
            throw exception;
        }
    };

    getUserByFilter = async (filter) => {
        try {
            const user = await UserModel.findOne(filter);
            if (!user) {
                throw { status: HttpResponseCode.BAD_REQUEST, message: "User not found", statusCode: HttpResponse.validationFailed };
            }
            return user;
        } catch (exception) {
            throw exception;
        }
    };

    updateUserById = async (data, userId) => {
        try {
            const user = await UserModel.findByIdAndUpdate(userId, { $set: data }, { new: true });
            return user;
        } catch (exception) {
            throw exception;
        }
    };

    getListOfUsers = async (filter = {}) => {
        try {
            const users = await UserModel.find({
                ...filter,
                status: "active",
            })
                .select("-password -activationToken -expiryTime")
                .sort({ firstName: 1 });
            return users;
        } catch (exception) {
            throw exception;
        }
    };

    updateUserProfile = async (userId, updateData) => {
    try {
   
        delete updateData.email;
        delete updateData.password;
        delete updateData.role;
        delete updateData.status;
        delete updateData.activationToken;
        delete updateData.expiryTime;

        const user = await UserModel.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select("-password -activationToken -expiryTime");

        if (!user) {
            throw { status: HttpResponseCode.BAD_REQUEST, message: "User not found", statusCode: HttpResponse.validationFailed };
        }

        return user;
    } catch (exception) {
        throw exception;
    }
};


updateBillingAddress = async (userId, billingData) => {
    try {
        const user = await UserModel.findByIdAndUpdate(
            userId,
            { $set: { billingAddress: billingData } },
            { new: true }
        ).select("billingAddress");

        return user;
    } catch (exception) {
        throw exception;
    }
};

changeUserPassword = async (userId, currentPassword, newPassword) => {
    try {
        const user = await UserModel.findById(userId);
        
        if (!bcrypt.compareSync(currentPassword, user.password)) {
            throw { status: HttpResponseCode.BAD_REQUEST, message: "Current password is incorrect.", statusCode: HttpResponse.validationFailed };
        }

        const hashedPassword = bcrypt.hashSync(newPassword, 12);
        
        await UserModel.findByIdAndUpdate(userId, {
            $set: { password: hashedPassword }
        });

        return true;
    } catch (exception) {
        throw exception;
    }
};

}

const authSvc = new AuthService();
export default authSvc;