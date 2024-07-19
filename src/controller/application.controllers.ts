import { NextFunction, Request, Response } from "express";
import { ApplicationDoc } from "../dto/application.dto";
import asyncWrapper from "../middlewares/AsyncWrapper";
import { Application as ApplicationModel } from "../model/application.model";
import { ValidateToken } from "../utils/password.utils";

export const addNew = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const isTokenValid = await ValidateToken(req);
    if (!isTokenValid) {
        return res.status(400).json({ message: "Access denied" });
    };
    req.body.loanStatus = 'Pending';
    
    const newApplication = await ApplicationModel.create<ApplicationDoc>(req.body);

    if (newApplication) {
        res.status(201).json({ message: "Application added successfully", application: newApplication });
    };
});


export const list = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const applications = await ApplicationModel.find({});
    res.status(200).json({ applications });
});


export const update = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.query; // Assuming application ID comes from the request URL

    const isTokenValid = await ValidateToken(req);
    if (!isTokenValid) {
        return res.status(400).json({ message: "Access denied" });
    }

    // Save the updated application
    const updatedApplication = await ApplicationModel.findByIdAndUpdate(id, req.body, { new: true });

    if (updatedApplication) {
        res.status(200).json({ message: "Application updated successfully", application: updatedApplication });
    } else {
        res.status(500).json({ message: "Error updating application" });
    }
});

export const getUserApplications = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    // Validate token
    const isTokenValid = await ValidateToken(req);
    if (!isTokenValid) {
        return res.status(400).json({ message: "Access denied" });
    }

    // Get user ID from the request (e.g., from req.user)
    const userId = req.user?._id;

    // Find applications where seller matches the user ID
    const userApplications = await ApplicationModel.find({ teacherId: userId });

    res.status(200).json({ applications: userApplications });
});


export const getApplicationById = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.query; // Assuming application ID comes from the request URL

    // Find the application by ID
    const application = await ApplicationModel.findById(id);

    if (application) {
        res.status(200).json({ application });
    } else {
        res.status(404).json({ message: "Application not found" });
    }
});

export const deleteApplication = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    // Validate token (assuming authorization is required for deletion)
    const isTokenValid = await ValidateToken(req);
    if (!isTokenValid) {
        return res.status(400).json({ message: "Access denied" });
    }

    const { id } = req.query;

    // Find the application to delete
    const applicationToDelete = await ApplicationModel.findById(id);

    if (!applicationToDelete) {
        return res.status(404).json({ message: "Application not found" });
    }

    // Delete the application
    await applicationToDelete.deleteOne();

    res.status(200).json({ message: "Application deleted successfully" });
});