import User from "../models/User";
import asyncWrapper from "../middlewares/asyncWrapper";
import successResponse from "../response/Success";
import csvWriterObject from "../utils/csvWriter";
import * as csv from "fast-csv";
import { diskStorageOprions, multerForCsv } from "../utils/multerFeatures";
import * as fs from "fs";
import path from "path";
import multer from "multer";
import Role from "../models/Role";
import createError from "../response/fail";
import apiFeatures from "../utils/ApiFeatures";

const teacherDiskStorageOption = diskStorageOprions("teachers", "temp");
const teacherStorage = multer.diskStorage(teacherDiskStorageOption);
export const uploadTeacherDataCsv = multerForCsv(teacherStorage);

const studentDiskStorageOption = diskStorageOprions("student", "student");
const studentStorage = multer.diskStorage(studentDiskStorageOption);
export const uploadStudentDataCsv = multerForCsv(studentStorage);

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
    const uploadedPath = "uploads/teachers/" + req.file?.filename;
    console.log("here");
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
    // console.log(req.user);
    const data = await temp;
    const toAdd: {
        firstName: string;
        lastName: string;
        email: string;
        dateOfBirth: string;
        gender: string;
        name: { first: String; last: string };
        password: String;
        role: String;
        createdBy: string;
        updatedBy: string;
    }[] = data.map((e) => {
        e.name = { first: e.firstName, last: e.lastName };
        e.password = e.firstName + " " + e.lastName;
        e.role = teacherId._id;
        e.createdBy = req.user._id;
        e.updatedBy = req.user._id;
        return e;
    });

    const success: { email: String; password: String }[] = [];
    const error: { email: String }[] = [];
    for (let i = 0; i < toAdd.length; i++) {
        const current = toAdd[i];
        try {
            await User.create(current);
            success.push({ email: current.email, password: current.password });
        } catch (e) {
            error.push({ email: current.email });
        }
    }

    await csvWriterObject("teacher", req.file?.filename!).writeRecords(success);
    // const teachers = await User.create(toAdd);
    const dataS = { teachers: success, path: `data/teacher/${req.file?.filename}` };
    const response = successResponse(dataS, 201, error);
    res.status(200).json(response);
});

const addStudents = asyncWrapper(async (req, res, next) => {
    const uploadPath = __dirname + "../../../uploads/student/" + req.file?.filename;
    const studentId = await Role.findOne({ name: "student", isActive: true }, "name");
    if (!studentId) {
        return next(createError("There was an error", 500));
    }

    const studentDataPromise: Promise<
        {
            firstName: string;
            lastName: string;
            email: string;
            dateOfBirth: string;
            gender: string;
        }[]
    > = new Promise((resolve, reject) => {
        const data: any[] = [];
        try {
            fs.createReadStream(uploadPath)
                .pipe(csv.parse({ headers: true }))
                .on("error", reject)
                .on("data", (d) => data.push(d))
                .on("end", (hahaa: number) => resolve(data));
        } catch (error) {
            next(error);
        }
    });

    const success: { email: string; password: string }[] = [];
    const error: string[] = [];
    const studentData = await studentDataPromise;
    for (let i = 0; i < studentData.length; i++) {
        const current = studentData[i];
        const data = {
            name: { first: current.firstName, last: current.lastName },
            email: current.email,
            gender: current.gender,
            dateOfBirth: current.dateOfBirth,
            role: studentId._id,
            password: current.firstName + "." + current.lastName,
            createdBy: req.user._id,
            updatedBy: req.user._id,
        };

        try {
            const student = await User.create(data);
            success.push({ email: student.email, password: current.firstName + "." + current.lastName });
        } catch (e) {
            console.log(e);
            error.push(current.email);
        }
    }

    await csvWriterObject("student", req.file?.filename!).writeRecords(success);
    const data = { studentData: success, path: `data/student/${req.file?.filename}` };
    // console.log(studentData);
    const response = successResponse(data, 201, error);
    res.status(response.status.code).json(response);
});

const getTeachers = asyncWrapper(async (req, res, next) => {
    const teacherId = await Role.findOne({ name: "teacher" });
    if (!teacherId) {
        return next(createError("There was an error", 400));
    }

    const { query, hitsLimit, pageNumber } = new apiFeatures(
        User.find({
            role: teacherId,
            isActive: true,
        }),
        req.query
    )
        .limitFields("teachers")
        .populateUpdatedBy()
        .sort()
        .search(["name.first"])
        .paginate();

    const teachers = await query.query;
    const data = { hitsLimit, pageNumber, count: teachers.length, teachers };
    const response = successResponse(data);
    res.status(200).json(response);
});

const getStudents = asyncWrapper(async (req, res, next) => {
    const studentId = await Role.findOne({ name: "student" });
    if (!studentId) {
        return next(createError("There was an error", 400));
    }

    const { query, hitsLimit, pageNumber } = new apiFeatures(
        User.find({
            role: studentId,
            isActive: true,
        }),
        req.query
    )
        .limitFields("teachers")
        .populateUpdatedBy()
        .sort()
        .search(["name.first"])
        .paginate();

    const students = await query.query;
    const data = { hitsLimit, pageNumber, count: students.length, students };
    const response = successResponse(data);
    res.status(200).json(response);
});

export { addAdmin, addTeachers, addStudents, getTeachers, getStudents };
