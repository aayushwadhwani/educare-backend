import User from "../models/User";
import asyncWrapper from "../middlewares/asyncWrapper";
import successResponse from "../response/Success";
import * as csv from "fast-csv";
import { diskStorageOprions, multerForCsv } from "../utils/multerFeatures";
import * as fs from "fs";
import path from "path";
import multer from "multer";
import Role from "../models/Role";
import createError from "../response/fail";

const dsckStorageOption = diskStorageOprions("teachers", "temp");
const storage = multer.diskStorage(dsckStorageOption);
export const uploadTeacherDataCsv = multerForCsv(storage);

const addAdmin = asyncWrapper(async (req, res) => {
    const toAdd = {
        name: {
            first: "Admin",
            last: "TSEC",
        },
        email: "admin@tsecedu.org",
        dateOfBirth: new Date(2001, 11, 11),
        gender: "male",
        password: process.env.ADMIN_PASSWORD,
        role: "admin",
    };

    const user = await User.create(toAdd);
    const data = { user };
    const response = successResponse(data, 201);

    res.status(response.status.code).json(response);
});

const addTeachers = asyncWrapper(async (req, res, next) => {
    const uploadedPath = __dirname + "../../../uploads/teachers/" + req.file?.filename;
    const teacherId = await Role.findOne({ name: "teacher", isActive: true }, "name");
    if (!teacherId) {
        return next(createError("There was an error.", 500));
    }
    const temp: Promise<
        {
            name: { first: string; last: string };
            firstName: string;
            lastName: string;
            email: string;
            dateOfBirth: string;
            gender: string;
            password: string;
            role: string;
            createdBy: string;
            updatedBy: string;
        }[]
    > = new Promise((resolve, reject) => {
        const data: any[] = [];
        try {
            fs.createReadStream(uploadedPath)
                .pipe(csv.parse({ headers: true }))
                .on("error", reject)
                .on("data", (d) => data.push(d))
                .on("end", (hahaa: number) => resolve(data));
        } catch (error) {
            next(error);
        }
    });
    console.log(req.user);
    const data = await temp;
    const toAdd: { firstName: string; lastName: string; email: string; dateOfBirth: string; gender: string }[] =
        data.map((e) => {
            e.name = { first: e.firstName, last: e.lastName };
            e.password = e.firstName + " " + e.lastName;
            e.role = teacherId._id;
            e.createdBy = req.user._id;
            e.updatedBy = req.user._id;
            return e;
        });

    const teachers = await User.create(toAdd);
    const response = successResponse(teachers, 201);
    res.status(200).json(response);
});

export { addAdmin, addTeachers };
