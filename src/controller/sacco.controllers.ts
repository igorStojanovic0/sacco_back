import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import asyncWrapper from "../middlewares/AsyncWrapper";
import RoleModel from '../model/role.model';
import SaccoModel from '../model/sacco.model';
import UserModel from '../model/user.model';
import RoleUserModel from '../model/user_role';
import UserSaccoModel from '../model/user_sacco';
import { ValidateToken, isTokenValid } from "../utils/password.utils";

export const addSacco = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {

    const isTokenValid = await ValidateToken(req);

    if (!isTokenValid) {
        return res.status(400).json({ message: "Access denied" });
    };

    const existingGroup = await SaccoModel.findOne({ name: req.body.name });
    if (existingGroup) {
        return res.status(400).json({ message: "Group already exists" });
    };

    const newSacco = await SaccoModel.create(req.body);

    if (newSacco) {
        const ManagerRole = await RoleModel.findOne({ role_name: "SaccoManager"})
    
        await UserSaccoModel.create({
            user_id: req?.body?.created_by,
            group_id: req?.body?.group_id,
            sacco_id: newSacco?._id,
            role_id: ManagerRole?.id,
            approved: 1
        })

        await RoleUserModel.create({
            user_id: req?.body?.created_by,
            role_id: ManagerRole?.id
        })

        res.status(201).json({ message: "newSacco added successfully", sacco: newSacco });
    };

});


export const getSaccoList = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const isTokenValid = await ValidateToken(req);
    const { group_id } = req?.query
    if (!isTokenValid) {
        return res.status(400).json({ message: "Access denied" });
    }

    const allSaccoList = await SaccoModel.find({ del_flag: 0 })
    
    res.status(201).json({ message: "successfully", allSaccoList: allSaccoList });

});

export const getJoinedSaccoList = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    
    const isTokenValid = await ValidateToken(req);
    if (!isTokenValid) {
        return res.status(400).json({ message: "Access denied" });
    }
    const existingUser = await UserModel.findOne({ email: req.user?.email });

    if (!existingUser) {
        return res.status(400).json({ message: "User not found" });
    }

    const userId = existingUser?.id
    // const { userId } = req.query
    
    if (userId) {
        try {

            if (typeof userId !== 'string' || !mongoose.Types.ObjectId.isValid(userId)) {
                throw new Error('Invalid userId: must be a valid ObjectId string');
            }

            const result = await UserSaccoModel.aggregate([
                {
                    $match: { user_id: new mongoose.Types.ObjectId(userId) }
                },
                {
                    $lookup: {
                        from: 'roles', // collection name in MongoDB (should match the name in your MongoDB)
                        localField: 'role_id',
                        foreignField: '_id',
                        as: 'roleDetails'
                    }
                },
                {
                    $unwind: '$roleDetails'
                },
                {
                    $lookup: {
                        from: 'saccos', // Collection name in MongoDB
                        localField: 'sacco_id',
                        foreignField: '_id',
                        as: 'saccoDetails'
                    }
                },
                {
                    $unwind: '$saccoDetails'
                },
                {
                    $project: {
                        _id: '$sacco_id',
                        approved: '$approved',
                        sacco_id: '$sacco_id',
                        group_id: '$group_id',
                        role_name: '$roleDetails.role_name',
                        name: '$saccoDetails.name',
                        entranceFee: {
                            adults: '$saccoDetails.adults',
                            children: '$saccoDetails.children',
                            teens:'$saccoDetails.teens',
                            friend: '$saccoDetails.friend',
                        },
                        shares: {
                            initialNumber: '$saccoDetails.initialNumber',
                            nominalPrice: '$saccoDetails.nominalPrice',
                            maxInitial:'$saccoDetails.maxInitial',
                        },
                        saving: {
                            minimumAmount: '$saccoDetails.minimumAmount',
                            lumpSum: '$saccoDetails.lumpSum',
                        },
                        notificationStatus: '$saccoDetails.notificationStatus',
                        loanType: '$saccoDetails.loanType',
                        priorityOfLoan: '$saccoDetails.priorityOfLoan',
                        traningProgram: '$saccoDetails.traningProgram',
                        role: {
                            admin: '$saccoDetails.admin',
                            treasurer: '$saccoDetails.treasurer',
                            secretary: '$saccoDetails.secretary',
                        },
                        approval: {
                            maker: '$saccoDetails.maker',
                            checker: '$saccoDetails.checker',
                            approver: '$saccoDetails.approver',
                        },
                        created_by: '$saccoDetails.created_by',
                    }
                }
            ]);
            res.status(201).json({ message: "successfully", joinedSaccoList: result });
            
        } catch (err) {
            throw err;
        }
    } else {
        return res.status(400).json({ message: "Failed" });
    }
    

});

export const joinSacco = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {

    const isTokenValid = await ValidateToken(req);
    

    if (!isTokenValid) {
        return res.status(400).json({ message: "Access denied" });
    };
    

    const existingGroup = await UserSaccoModel.findOne({ user_id: req.body.user_id, group_id: req.body.group_id, sacco_id: req.body.sacco_id });
    
    if (existingGroup) {
        return res.status(400).json({ message: "You have already joined!" });
    } else {
        const Role = await RoleModel.findOne({ role_name: "SaccoUser"})

        const newJoinSacco = await UserSaccoModel.create({
            user_id: req?.body?.user_id,
            group_id: req?.body?.group_id,
            sacco_id: req?.body?.sacco_id,
            role_id: Role?._id,
            approved: 0
        });

        if (newJoinSacco) {
            const existingRole = await RoleUserModel.findOne({user_id: req.body.user_id, role_id: Role?._id})
            
            if(!existingRole) {
                await RoleUserModel.create({
                    user_id: req?.body?.user_id,
                    role_id: Role?.id
                })
            }
            
            res.status(201).json({ message: "successfully", group: newJoinSacco });
        };
    }

    

});

export const groupUpdate = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    
});

export const deleteGroup = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    
});

export const getSaccoUserList = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {

    const authToken = req.get('Authorization');
    
    if (!authToken?.split(' ')[1]) {
        return res.status(401).json({ message: "Access denied!" });
    }
    
    const isValid = await isTokenValid(req);
    if (!isValid) {
        return res.status(401).json({ message: "Access denied!" });
    }

    const { saccoId } = req?.query

    if(saccoId) {
        try {
            if (typeof saccoId !== 'string' || !mongoose.Types.ObjectId.isValid(saccoId)) {
                throw new Error('Invalid saccoId: must be a valid ObjectId string');
            }

            const result = await UserSaccoModel.aggregate([
                {
                    $match: { sacco_id: new mongoose.Types.ObjectId(saccoId) }
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
                        sacco_id: '$sacco_id',
                        approved: '$approved'
                    }
                }
            ]);

            res.status(201).json({ message: "successfully", saccoUserList: result });

        } catch (err) {
            return res.status(400).json({ message: "Failed" });
        }
    }
})