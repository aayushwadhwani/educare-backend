import Class from "../models/Class";
import asyncWrapper from "../middlewares/asyncWrapper";
import createError from "../response/fail";
import Subject from "../models/Subject";
import successResponse from "../response/Success";
import apiFeatures from "../utils/ApiFeatures";

const addSubject = asyncWrapper(async (req, res, next) => {
    const { name, class: classId } = req.body;
    const classExist = await Class.findOne({ _id: classId, isActive: true });
    if (!classExist) {
        return next(createError("Cannot find class", 400));
    }

    const classWithSameSubject = await Subject.findOne({ name, class: classId });
    if (classWithSameSubject) {
        return next(createError("Same subject exist in this class"));
    }
    const toAdd = {
        name,
        uniqueName: name,
        class: classId,
        teacher: req.user._id,
        createdBy: req.user._id,
        updatedBy: req.user._id,
    };

    const subject = await Subject.create(toAdd);
    const data = { subject };
    const response = successResponse(data, 201);
    res.status(response.status.code).json(response);
});

const getSubjects = asyncWrapper(async (req, res, next) => {
    const teacher = req.user._id;
    const { query, pageNumber, hitsLimit } = new apiFeatures(Subject.find({ teacher, isActive: true }), req.query)
        .populateUpdatedBy()
        .search(["name"])
        .sort()
        .limitFields("subject")
        .populate("teacher", "name")
        .populate("class", "name")
        .paginate();
    const subjects = await query.query;
    const data = { hitsLimit, pageNumber, subjects };
    const response = successResponse(data);
    res.status(response.status.code).json(response);
});

const getSubjectById = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const teacher = req.user._id;

    const subject = await Subject.findOne({ _id: id, isActive: true, teacher })
        .select("name class updatedAt updatedBy")
        .populate({
            path: "class",
            select: "name students",
            populate: { path: "students", select: "name email" },
        })
        .populate("updatedBy", "name");
    if (!subject) {
        return next(createError(`Cannot find subject with id: ${id}`, 400));
    }

    const data = { subject };
    const response = successResponse(data);
    res.status(response.status.code).json(response);
});

const deleteSubject = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const teacher = req.user._id;

    const subjectExist = await Subject.findOne({ _id: id, teacher, isActive: true });
    if (!subjectExist) {
        return next(createError(`Cannot find subject with id: ${id}`, 400));
    }
    const deleteSubject = await Subject.findOneAndUpdate(
        { _id: id, teacher, isActive: true },
        { isActive: false, updatedBy: teacher },
        { new: true, runValidators: true }
    );

    const data = { deleted: !deleteSubject.isActive, id: deleteSubject._id };
    const response = successResponse(data);

    res.status(response.status.code).json(response);
});
export { addSubject, getSubjects, getSubjectById, deleteSubject };
