import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import asyncWrapper from "../middlewares/AsyncWrapper";
import RoleModel from "../model/role.model";
import { Token } from "../model/token.model";
import UserModel from "../model/user.model";
import UserGroupModel from "../model/user_group";
import UserGroupChannelModel from "../model/user_groupChannel";
import RoleUser from "../model/user_role";
import { GenerateOTP, sendEmail } from "../utils/notification.utils";

import { GeneratePassword, GenerateSalt, GenerateToken, ValidatePassword, ValidateToken, isTokenValid } from "../utils/password.utils";

export const signUp = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    // Check existing email
    const existingUser = await UserModel.findOne({ email: req.body.email });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    };
    const salt = await GenerateSalt();
    req.body.password = await GeneratePassword(req.body.password, salt);

    // Create OTP
    const { otp, expiryDate } = GenerateOTP();
    req.body.otp = otp;
    req.body.salt = salt;
    req.body.otpExpiryTime = expiryDate;

    
    if (req.body.role === 'Manager') {
        req.body.verified = true;
    }
    
    // Record account
    const recordedUser = await UserModel.create(req.body);
    
    var emailMessageBody = '';
    if (recordedUser.role === 'Manager') {
        emailMessageBody = `Hello ${recordedUser.givenName},\n\nYour OTP is ${otp}. \n\nClick on the link bellow to validate your account: \n${process.env.CLIENT_URL}/manager/auth/verifyotp?id=${recordedUser._id}.\n\nBest regards,\n\nTwezimbe`;
    } else if (recordedUser.role === 'Admin') {
        emailMessageBody = `Hello ${recordedUser.givenName},\n\nYour OTP is ${otp}. \n\nClick on the link bellow to validate your account: \n${process.env.CLIENT_URL}/admin/auth/verifyotp?id=${recordedUser._id}.\n\nBest regards,\n\nTwezimbe`;
    } else {
        emailMessageBody = `Hello ${recordedUser.givenName},\n\nYour OTP is ${otp}. \n\nClick on the link bellow to validate your account: \n${process.env.CLIENT_URL}/verifyotp?id=${recordedUser._id}.\n\nBest regards,\n\nTwezimbe`;
    }

    // Send email
    if (recordedUser) {
        
        const res = await sendEmail(req.body.email, "Verify your account", emailMessageBody);
        console.log('res', res);
        
    }


    // const transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //       user: 'deptop725@gmail', // replace with your email
    //       pass: '!123qwe!' // replace with your email password
    //     }
    //   });

    //   const mailOptions = {
    //     from: 'deptop725@gmail', // replace with your email
    //     to: req.body.email,
    //     subject: 'Verification Code',
    //     text: `Your verification code is: ${otp}`
    //   };

    //   try {
    //     await transporter.sendMail(mailOptions);
    //     res.status(200).send({ message: 'Verification code sent!', code: otp }); // send code for development/testing purposes
    //   } catch (error) {
    //     res.status(500).send({ message: 'Error sending verification code', error });
    //   }
    

    //save user_role

    const userRole = await RoleModel.findOne({ role_name: 'User'});
    
    const roleUser = await RoleUser.create({role_id: userRole?._id, user_id: recordedUser._id})

    // Send response
    res.status(200).json({ message: "Account created!" });
});


export const signIn = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    // Check existing email
    const existingUser = await UserModel.findOne({ email: req.body.email });
    if (!existingUser) {
        return res.status(400).json({ message: "Invalid email or password" });
    };

    // Check password
    const isPasswordValid = await ValidatePassword(req.body.password, existingUser.password, existingUser.salt);
    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid email or password" });
    };

    if (!existingUser.verified) {
        return res.status(400).json({ message: "Please verify your account first" });
    }

    const token = await GenerateToken({
        _id: existingUser._id,
        email: existingUser.email,
        verified: existingUser.verified
    });

    const { password: hashedPassword, salt,otp, otpExpiryTime,verified, ...rest } = existingUser._doc;

    // Send response
    res
        .cookie("access-token", token, { httpOnly: true, expires: new Date(Date.now() + 3600000) })
        .status(200)
        .json({ message: "Sign in successful", token });
});

export const getUserProfile = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const authToken = req.get('Authorization');
    
    if (!authToken?.split(' ')[1]) {
        return res.status(401).json({ message: "Access denied!" });
    }
    
    const isValid = await isTokenValid(req);
    if (!isValid) {
        return res.status(401).json({ message: "Access denied!" });
    }

    const existingUser = await UserModel.findOne({ email: req.user?.email });

    if (!existingUser) {
        return res.status(400).json({ message: "User not found" });
    }
    
    const token = await GenerateToken({
        _id: existingUser._id,
        email: existingUser.email,
        verified: existingUser.verified
    });

    const { password: hashedPassword, salt,otp, otpExpiryTime,verified, ...rest } = existingUser._doc;

    // Send response
    res
        .cookie("access-token", token, { httpOnly: true, expires: new Date(Date.now() + 3600000) })
        .status(200)
        .json(rest);
});


export const regenerateOTP = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const foundUser = await UserModel.findById(req.body.id);
    if (!foundUser) {
        return res.status(400).json({ message: "Account with this email is not registered!" });
    };

    // Generate new OTP
    const { otp, expiryDate } = GenerateOTP();

    // Update user info
    foundUser.otp = otp;
    foundUser.otpExpiryTime = expiryDate;
    await foundUser.save();

    // Send email
    await sendEmail(foundUser.email, "Verify your account", `Hello ${foundUser.givenName},\n\nYour OTP is ${otp}. \n\nClick on the link bellow to validate your account: \n${process.env.CLIENT_URL}/verifyotp?id=${foundUser._id}\n\nBest regards,\n\nTwezimbe`);
    
    // Send response
    res.status(200).json({ message: "OTP resent!" });
});


export const verifyOTP = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {

    const foundUser = await UserModel.findOne({ otp: req.body.otp });
    
    if (!foundUser) {
        return res.status(400).json({ message: "Invalid OTP" });
    };

    if (new Date(foundUser.otpExpiryTime).getTime() < new Date().getTime()) {
        return res.status(400).json({ message: "OTP expired" });
    };

    foundUser.verified = true;
    const savedUser = await foundUser.save();

    if (savedUser) {
        return res.status(200).json({ message: "User account verified!" });
    }
});


export const forgotPassword = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const foundUser = await UserModel.findOne({ email: req.body.email });
    if (!foundUser) {
        return res.status(400).json({ message: "Account with this email is not registered!" });
    };

    const token = await GenerateToken({
        _id: foundUser._id,
        email: foundUser.email,
        verified: foundUser.verified
    });

    await Token.create({
        token,
        user: foundUser._id,
        expirationDate: new Date().getTime() + (60 * 1000 * 5),
    });

    const link = `${process.env.CLIENT_URL}/resetpassword?token=${token}&id=${foundUser._id}`
    const emailBody = `Hello ${foundUser.givenName},\n\nClick on the link bellow to reset your password.\n\n${link}\n\nBest regards,\n\nTwezimbe`;

    await sendEmail(foundUser.email, "Reset your password", emailBody);

    res.status(200).json({ message: "We sent you a reset password link on your email!" });
});


export const resetPassword = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const isTokenValid = await ValidateToken(req);
    if (!isTokenValid) {
        return res.status(400).json({ message: "Invalid token" });
    };

    const foundUser = await UserModel.findById(req.user?._id);
    if (!foundUser) {
        return res.status(400).json({ message: "Invalid token" });
    };

    foundUser.password = await GeneratePassword(req.body.password, foundUser.salt);

    await foundUser.save()
    await Token.deleteOne({ user: req.user?._id });

    res.status(200).json({ message: "Your password has been reset!" });
});


export const updateAccount = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    
    const isTokenValid = await ValidateToken(req);
    if (!isTokenValid) {
        return res.status(400).json({ message: "Access denied" });
    };
    
    await UserModel.findByIdAndUpdate(req.user?._id, {
        $set: {
            title: req.body.title,
            surName: req.body.surName,
            givenName: req.body.givenName,
            otherNames: req.body.otherNames,
            email: req.body.email,
            phone: req.body.phone,
            code: req.body.code,
            addressLine1: req.body.addressLine1,
            addressLine2: req.body.addressLine2,
            city: req.body.city,
            photograph: req.body.photograph,
            gender: req.body.gender,
            tribe: req.body.tribe,
            religion: req.body.religion,
            placeOfBirth: req.body.placeOfBirth,
            currentParish: req.body.currentParish,
            birthday: req.body.birthday,
            nationalIDNumber: req.body.nationalIDNumber,
            nationalIDPhoto: req.body.nationalIDPhoto,
            homeAddress: req.body.homeAddress,
            homeLocation: req.body.homeLocation,
            districtOfBirth: req.body.districtOfBirth,
            birthParish: req.body.birthParish,
            birthVillage: req.body.birthVillage,
            birthHome: req.body.birthHome,
            maritalStatus: req.body.maritalStatus,
            cprofessionity: req.body.profession,
            jobTitle: req.body.jobTitle,
            nextOfKin: req.body.nextOfKin,
            monthlyIncome: req.body.monthlyIncome,
            bankName: req.body.bankName,
            accountNumber: req.body.accountNumber,
            registeredMobileAccount: req.body.registeredMobileAccount,
            registeredEmailWithBank: req.body.registeredEmailWithBank,
            highestEducation: req.body.highestEducation,
            otherEducation: req.body.otherEducation,
            employmentStatus: req.body.employmentStatus,
            placeOfWorkAddress: req.body.placeOfWorkAddress,
            employerDetails: req.body.employerDetails,
            groupMembership: req.body.groupMembership,
            userID: req.body.userID,
            notificationPreferences: req.body.notificationPreferences,
            twoFactorAuth: req.body.twoFactorAuth,
            securityQuestions: req.body.securityQuestions,
            is_profileCompleted: true
        },
        new: true
    });
    
    const updatedUser = await UserModel.findById(req.user?._id);
    
    if (!updatedUser) {
        return res.status(400).json({ message: "User not found" });
    };

    res.status(200).json({ message: "Account info updated successfully!", user: updatedUser });
});

export const verifyToken = asyncWrapper(async(req: Request, res: Response, next: NextFunction) => {
    const validToken = await isTokenValid(req);

    if (!validToken) {
        return res.status(400).json({ message: "Access denied" });
    } 
    res.status(200).json({ message: "Token is valid" });
});


export const getAllUsers = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const authToken = req.get('Authorization');
    
    if (!authToken?.split(' ')[1]) {
        return res.status(401).json({ message: "Access denied!" });
    }
    
    const isValid = await isTokenValid(req);
    if (!isValid) {
        return res.status(401).json({ message: "Access denied!" });
    }

    const allUsers = await UserModel.find({ del_falg: 0 })
    
    
    res.status(201).json({ message: "successfully", allUsers: allUsers });

});

export const getGroupUserList = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const authToken = req.get('Authorization');
    
    if (!authToken?.split(' ')[1]) {
        return res.status(401).json({ message: "Access denied!" });
    }
    
    const isValid = await isTokenValid(req);
    if (!isValid) {
        return res.status(401).json({ message: "Access denied!" });
    }

    const { groupId } = req?.query

    if(groupId) {
        try {
            if (typeof groupId !== 'string' || !mongoose.Types.ObjectId.isValid(groupId)) {
                throw new Error('Invalid groupId: must be a valid ObjectId string');
            }

            const result = await UserGroupModel.aggregate([
                {
                    $match: { group_id: new mongoose.Types.ObjectId(groupId) }
                },
                {
                    $lookup: {
                        from: 'users', // Collection name in MongoDB
                        localField: 'user_id',
                        foreignField: '_id',
                        as: 'userDetails'
                    }
                },
                {
                    $unwind: '$userDetails'
                },
                {
                    $lookup: {
                        from: 'roles',
                        localField: 'role_id',
                        foreignField: '_id',
                        as: 'roleInfo'
                    }
                },
                { $unwind: '$roleInfo' },
                {
                    $project: {
                        user_id: '$userDetails._id',
                        title: '$userDetails.title',
                        surName: '$userDetails.surName',
                        givenName: '$userDetails.givenName',
                        otherNames: '$userDetails.otherNames',
                        photograph: '$userDetails.photograph',
                        gender: '$userDetails.gender',
                        tribe: '$userDetails.tribe',
                        religion: '$userDetails.religion',
                        placeOfBirth: '$userDetails.placeOfBirth',
                        currentParish: '$userDetails.currentParish',
                        birthday: '$userDetails.birthday',
                        nationalIDNumber: '$userDetails.nationalIDNumber',
                        nationalIDPhoto: '$userDetails.nationalIDPhoto',
                        email: '$userDetails.email',
                        phone: '$userDetails.phone',
                        homeAddress: '$userDetails.homeAddress',
                        homeLocation: '$userDetails.homeLocation',
                        districtOfBirth: '$userDetails.districtOfBirth',
                        birthParish: '$userDetails.birthParish',
                        birthVillage: '$userDetails.birthVillage',
                        birthHome: '$userDetails.birthHome',
                        maritalStatus: '$userDetails.maritalStatus',
                        profession: '$userDetails.profession',
                        placeOfWorkAddress: '$userDetails.placeOfWorkAddress',
                        is_active: '$userDetails.is_active',
                        userID: '$userDetails.userID',
                        del_falg: '$userDetails.del_falg',
                        role_name: '$roleInfo.role_name',
                        group_id: '$group_id'
                    }
                }
            ]);

            res.status(201).json({ message: "successfully", groupUserList: result });

        } catch (err) {
            return res.status(400).json({ message: "Failed" });
        }
    }

    const allUsers = await UserModel.find({ del_falg: 0 })
    
    
    res.status(201).json({ message: "successfully", allUsers: allUsers });

});

export const getGroupChannelUserList = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const authToken = req.get('Authorization');
    
    if (!authToken?.split(' ')[1]) {
        return res.status(401).json({ message: "Access denied!" });
    }
    
    const isValid = await isTokenValid(req);
    if (!isValid) {
        return res.status(401).json({ message: "Access denied!" });
    }
    const { channelId } = req?.query
        try {
            if (typeof channelId !== 'string' || !mongoose.Types.ObjectId.isValid(channelId)) {
                throw new Error('Invalid channelId: must be a valid ObjectId string');
            }

          
            const result = await UserGroupChannelModel.aggregate([
                {
                    $match: { channel_id: new mongoose.Types.ObjectId(channelId) }
                },
                {
                    $lookup: {
                        from: 'users', // Collection name in MongoDB
                        localField: 'user_id',
                        foreignField: '_id',
                        as: 'userDetails'
                    }
                },
                {
                    $unwind: '$userDetails'
                },
                {
                    $lookup: {
                        from: 'roles',
                        localField: 'role_id',
                        foreignField: '_id',
                        as: 'roleInfo'
                    }
                },
                { $unwind: '$roleInfo' },
                {
                    $project: {
                        user_id: '$userDetails._id',
                        title: '$userDetails.title',
                        surName: '$userDetails.surName',
                        givenName: '$userDetails.givenName',
                        otherNames: '$userDetails.otherNames',
                        photograph: '$userDetails.photograph',
                        gender: '$userDetails.gender',
                        tribe: '$userDetails.tribe',
                        religion: '$userDetails.religion',
                        placeOfBirth: '$userDetails.placeOfBirth',
                        currentParish: '$userDetails.currentParish',
                        birthday: '$userDetails.birthday',
                        nationalIDNumber: '$userDetails.nationalIDNumber',
                        nationalIDPhoto: '$userDetails.nationalIDPhoto',
                        email: '$userDetails.email',
                        phone: '$userDetails.phone',
                        homeAddress: '$userDetails.homeAddress',
                        homeLocation: '$userDetails.homeLocation',
                        districtOfBirth: '$userDetails.districtOfBirth',
                        birthParish: '$userDetails.birthParish',
                        birthVillage: '$userDetails.birthVillage',
                        birthHome: '$userDetails.birthHome',
                        maritalStatus: '$userDetails.maritalStatus',
                        profession: '$userDetails.profession',
                        placeOfWorkAddress: '$userDetails.placeOfWorkAddress',
                        is_active: '$userDetails.is_active',
                        userID: '$userDetails.userID',
                        del_falg: '$userDetails.del_falg',
                        role_name: '$roleInfo.role_name'
                    }
                }
            ]);

            res.status(201).json({ message: "successfully", groupChannelUserList: result });

        } catch (err) {
            return res.status(400).json({ message: "Failed" });
        }
});



export const updateUserStatus = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {

    const { userId, is_active} = req?.body
    const foundUser = await UserModel.findOne({ _id: userId });
    
    if (!foundUser) {
        return res.status(400).json({ message: "Invalid User" });
    };

    foundUser.is_active = is_active;
    const savedUser = await foundUser.save();

    if (savedUser) {
        return res.status(200).json({ message: "User status changed!" });
    }
});

export const updateUserRole = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {

    const { user_id, group_id, role_name} = req?.body

    const foundRole = await RoleModel.findOne({ role_name: role_name })

    const foundUser = await UserGroupModel.findOne({ group_id: group_id, user_id: user_id});
    
    if (!foundUser) {
        return res.status(400).json({ message: "Invalid User" });
    };

    if (!foundRole) {
        return res.status(400).json({ message: "Invalid Role" });
    };

    foundUser.role_id = foundRole?.id;
    const savedUser = await foundUser.save();

    if (savedUser) {
        return res.status(200).json({ message: "User status changed!" });
    }
});

