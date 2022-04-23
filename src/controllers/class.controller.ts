import { diskStorageOprions, multerForCsv } from "../utils/multerFeatures";
import asyncWrapper from "../middlewares/asyncWrapper";
import multer, { diskStorage } from "multer";
import * as fs from "fs";
const classDiskStorageOptions = diskStorageOprions("class", "class");
const classStorage = diskStorage(classDiskStorageOptions);
export const classDataCsv = multerForCsv(classStorage);
import * as csv from "fast-csv";
import Role from "../models/Role";
import createError from "../response/fail";
import User from "../models/User";
import Class from "../models/Class";
import successResponse from "../response/Success";
import apiFeatures from "../utils/ApiFeatures";

const createClass = asyncWrapper(async (req, res, next) => {
    const uploadedPath = "uploads/class/" + req.file?.filename;
    const classDataPromise: Promise<{ student: string }[]> = new Promise((resolve, reject) => {
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
    const data: { student: string }[] = await classDataPromise;
    const toAdd: {
        name: string;
        teacher: string;
        createdBy: string;
        updatedBy: string;
        students: string[];
        uniqueName: string;
    } = {
        uniqueName: req.body.name,
        name: req.body.name,
        teacher: req.user._id,
        createdBy: req.user._id,
        updatedBy: req.user._id,
        students: [],
    };

    const role = await Role.findOne({ name: "student", isActive: true }, "name");
    if (!role) {
        return next(createError("There was an error", 500));
    }

    const error: string[] = [];
    for (let i = 0; i < data.length; i++) {
        const student = await User.findOne({ _id: data[i].student, isActive: true, role: role._id });
        if (!student) {
            error.push(data[i].student);
            continue;
        }
        toAdd.students.push(data[i].student);
    }

    console.log(toAdd);
    const addedClass = await Class.create(toAdd);
    const responseData = { addedClass };
    const response = successResponse(responseData, 201, error);
    res.status(response.status.code).json(response);
});

const getAllClass = asyncWrapper(async (req, res, next) => {
    const teacher = req.user._id;
    const { query, pageNumber, hitsLimit } = new apiFeatures(Class.find({ teacher, isActive: true }), req.query)
        .populateUpdatedBy()
        .search(["name"])
        .limitFields("class")
        .populate("students", "name email gender")
        .paginate();

    const classes = await query.query;
    const data = { hitsLimit, pageNumber, classes };
    const response = successResponse(data);

    res.status(response.status.code).json(response);
});

const deleteClass = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const updatedBy = req.user._id;

    const classExist = await Class.findOne({ _id: id, isActive: true }, "name");
    if (!classExist) {
        return next(createError(`No class found with id: ${id}`, 400));
    }
    const deleteClass = await Class.findOneAndUpdate(
        { _id: id, isActive: true },
        { isActive: false, updatedBy },
        { new: true, runValidators: true }
    );

    const data = { deleted: !deleteClass.isActive, id };
    const response = successResponse(data);

    res.status(response.status.code).json(response);
});
export { createClass, getAllClass, deleteClass };
