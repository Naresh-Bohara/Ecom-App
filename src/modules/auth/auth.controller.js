import HttpResponseCode from "../../constants/http-status-code.contants.js";
import HttpResponse from "../../constants/response-status.contants.js";
import authSvc from "./auth.service.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

class AuthController {
    register = async (req, res, next) => {
        try {
            const formattedData = await authSvc.transformCreateUser(req);
            const user = await authSvc.registerUser(formattedData);
            await authSvc.sendActivationEmail(user);

            res.json({
                data: {
                    _id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName
                },
                message: "Registration successful. Please check your email for activation code.",
                status: HttpResponse.success,
                options: null
            });
        } catch (exception) {
            next(exception);
        }
    };

    activateUser = async (req, res, next) => {
        try {
            const { email, otp } = req.body;
            const user = await authSvc.getUserByFilter({ email });

            if (user.status !== "inactive") {
                throw { status: HttpResponseCode.BAD_REQUEST, message: "User already activated.", statusCode: HttpResponse.validationFailed };
            }

            if (user.activationToken !== otp) {
                throw { status: HttpResponseCode.BAD_REQUEST, message: "Incorrect OTP code", statusCode: HttpResponse.validationFailed };
            }

            const now = new Date().getTime();
            const otpExpiry = new Date(user.expiryTime).getTime();

            if (now > otpExpiry) {
                throw { status: HttpResponseCode.BAD_REQUEST, message: "OTP code expired", statusCode: HttpResponse.validationFailed };
            }

            await authSvc.updateUserById({
                status: "active",
                expiryTime: null,
                activationToken: null
            }, user._id);

            res.json({
                data: null,
                message: "Account activated successfully. Please login to continue.",
                status: HttpResponse.success,
                options: null
            });
        } catch (exception) {
            next(exception);
        }
    };

    resendOtp = async (req, res, next) => {
        try {
            const { email } = req.body;
            const user = await authSvc.getUserByFilter({ email });

            if (user.status !== "inactive") {
                throw { status: HttpResponseCode.BAD_REQUEST, message: "User already activated.", statusCode: HttpResponse.validationFailed };
            }

            const newOtp = authSvc.generateActivationOtp();
            await authSvc.updateUserById(newOtp, user._id);
            await authSvc.reSendActivationEmail({ 
                email: user.email, 
                otp: newOtp.activationToken, 
                name: `${user.firstName} ${user.lastName}` 
            });

            res.json({
                data: null,
                message: "A new OTP code has been sent to your email.",
                status: HttpResponse.success,
                options: null
            });
        } catch (exception) {
            next(exception);
        }
    };

    login = async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const user = await authSvc.getUserByFilter({ email });

            if (user.status !== "active") {
                throw { status: HttpResponseCode.BAD_REQUEST, message: "Account not activated. Please activate your account first.", statusCode: HttpResponse.user.notActivate };
            }

            if (!bcrypt.compareSync(password, user.password)) {
                throw { status: HttpResponseCode.BAD_REQUEST, message: "Invalid credentials.", statusCode: HttpResponse.user.credentialNotMatch };
            }

            const payload = { sub: user._id };
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10h' });
            const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15d" });

            res.json({
                data: {
                    token,
                    refreshToken,
                    detail: {
                        _id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        role: user.role,
                        phone: user.phone,
                        address: user.address,
                        billingAddress: user.billingAddress,
                        image: user.image
                    }
                },
                message: "Login successful.",
                status: HttpResponse.success,
                options: null
            });
        } catch (exception) {
            next(exception);
        }
    };

    getLoggedInUser = (req, res, next) => {
        try {
            res.json({
                data: req.loggedInUser,
                message: "User profile fetched.",
                status: HttpResponse.success,
                options: null
            });
        } catch (exception) {
            next(exception);
        }
    };

    refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({
                data: null,
                message: "Refresh token not found.",
                status: "UNAUTHENTICATED",
                options: null
            });
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

        const payload = { sub: decoded.sub };

        const newToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "10h" });
        const newRefreshToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15d" });

        res.json({
            data: {
                token: newToken,
                refreshToken: newRefreshToken
            },
            message: "Token refreshed.",
            status: HttpResponse.success,
            options: null
        });
    } catch (exception) {
        next(exception);
    }
};

    getUserList = async (req, res, next) => {
        try {
            const role = req?.query?.role || null;
            let filter = { _id: { $ne: req.loggedInUser._id } };
            if (role) filter = { ...filter, role };

            const userList = await authSvc.getListOfUsers(filter);
            res.json({
                data: userList,
                message: "User list fetched.",
                status: HttpResponse.success,
                options: null
            });
        } catch (exception) {
            next(exception);
        }
    };

    changePassword = async (req, res, next) => {
    try {
        const userId = req.loggedInUser._id;
        const { currentPassword, newPassword } = req.body;

        await authSvc.changeUserPassword(userId, currentPassword, newPassword);

        res.json({
            data: null,
            message: "Password changed successfully.",
            status: HttpResponse.success,
            options: null
        });
    } catch (exception) {
        next(exception);
    }
};


    updateProfile = async (req, res, next) => {
    try {
        const userId = req.loggedInUser._id;
        const updateData = req.body;
        const file = req.file;

        // Upload image if provided
        if (file) {
            updateData.image = await FileUploadService.uploadFile(file.buffer, "/users");
        }

        const updatedUser = await authSvc.updateUserProfile(userId, updateData);

        res.json({
            data: {
                _id: updatedUser._id,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.email,
                phone: updatedUser.phone,
                address: updatedUser.address,
                billingAddress: updatedUser.billingAddress,
                image: updatedUser.image,
                role: updatedUser.role
            },
            message: "Profile updated successfully.",
            status: HttpResponse.success,
            options: null
        });
    } catch (exception) {
        next(exception);
    }
};

updateBillingAddress = async (req, res, next) => {
    try {
        const userId = req.loggedInUser._id;
        const billingData = req.body;

        const updatedUser = await authSvc.updateUserProfile(userId, {
            billingAddress: billingData
        });

        res.json({
            data: updatedUser.billingAddress,
            message: "Billing address updated successfully.",
            status: HttpResponse.success,
            options: null
        });
    } catch (exception) {
        next(exception);
    }
}
}

const authCtrl = new AuthController();
export default authCtrl;