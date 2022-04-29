import asyncWrapper from "../middlewares/asyncWrapper";
import { diskStorageOptionV2, multerForAny } from "../utils/multerFeatures";
import { diskStorage } from "multer";
import Subject from "../models/Subject";
import createError from "../response/fail";
import Assignment from "../models/Assignment";
import { readFilePromise, unlink } from "../utils/promisify";
import successResponse from "../response/Success";
import ApiFeatures from "../utils/ApiFeatures";
import S3Service from "../utils/S3Features";

const assignmentDiskStorage = diskStorageOptionV2("assignment");
const assignmentStorage = diskStorage(assignmentDiskStorage);
export const assignmentMulter = multerForAny(assignmentStorage);

const addAssignment = asyncWrapper(async (req, res, next) => {
    const createdBy = req.user._id;
    const {
        name,
        description,
        subject,
        dueDate,
    }: { name: string; description: string; subject: string; students: string; dueDate: string } = req.body;

    const subjectThere = await Subject.findOne({ _id: subject, isActive: true, teacher: createdBy }).populate(
        "class",
        "students"
    );
    if (!subjectThere) {
        return next(createError(`Cannot find subject with id: ${subject}`));
    }
    const students: string[] = subjectThere.class.students;

    const toAdd: {
        name: string;
        description: string;
        subject: string;
        students: string[];
        dueDate: string;
        // pdfReference?: string;
        // pdfReferenceOriginalName?: string;
        createdBy: string;
        updatedBy: string;
    } = {
        name,
        description,
        subject,
        students,
        dueDate,
        createdBy,
        updatedBy: createdBy,
    };

    const assignment = await Assignment.create(toAdd);
    // res.json({ assignment });

    if (req.file) {
        try {
            const originalName = req.file.originalname;
            const s3 = new S3Service();
            const fileContent = await readFilePromise(`uploads/assignment/${req.file.filename}`);
            const s3Object = await s3.putObject(`assignments/${assignment._id}/${req.file.filename}`, fileContent);
            assignment.pdfReference = s3Object;
            assignment.pdfReferenceOriginalName = originalName;
            await assignment.save({ validateBeforeSave: false });
            await unlink(`uploads/assignment/${req.file.filename}`);
        } catch (error) {
            await assignment.deleteOne({ _id: assignment._id });
            await unlink(`uploads/assignment/${req.file.filename}`);
            const message = `There was an Error: ${error}`;
            return next(createError(message, 400));
        }
    }

    const data = { assignment };
    const response = successResponse(data, 201);
    res.status(response.status.code).json(response);
});

const getAssignment = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const { pageNumber, hitsLimit, query } = new ApiFeatures(
        Assignment.find({ isActive: true, subject: id }),
        req.query
    )
        .sort()
        .populateUpdatedBy()
        .limitFields("assignments")
        .search(["name"])
        .paginate();

    const assignments = await query.query;
    const s3Service = new S3Service();
    for (let i = 0; i < assignments.length; i++) {
        assignments[i].pdfReference = await s3Service.getSignedUrl(assignments[i].pdfReference);
    }
    const data = { hitsLimit, pageNumber, assignments };
    const response = successResponse(data);
    res.status(response.status.code).json(response);
});

export { addAssignment, getAssignment };
