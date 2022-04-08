import Class from "../models/Class";
import asyncWrapper from "../middlewares/asyncWrapper";
import createError from "../response/fail";
import Subject from "../models/Subject";
import successResponse from "../response/Success";

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

export { addSubject };
