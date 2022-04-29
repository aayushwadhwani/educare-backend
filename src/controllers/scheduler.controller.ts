import Subject from "../models/Subject";
import asyncWrapper from "../middlewares/asyncWrapper";
import createError from "../response/fail";
import Scheduler from "../models/Scheduler";
import successResponse from "../response/Success";
import mongoose from "mongoose";

const addSchedule = asyncWrapper(async (req, res, next) => {
    const teacher = req.user._id;
    const { subject, startTime, endTime, link, description } = req.body;
    const studentsQuery = await Subject.findOne({ _id: subject, isActive: true, teacher })
        .select("name class teacher")
        .populate({ path: "class", select: "name students" });

    if (!studentsQuery) {
        return next(createError("Please provide valid subject", 400));
    }
    const students = studentsQuery.class.students;
    console.log(students);
    const toAdd = {
        startTime,
        endTime,
        subject,
        teacher,
        link,
        description,
        students,
        createdBy: teacher,
        updatedBy: teacher,
    };

    const schedule = await Scheduler.create(toAdd);
    const data = { schedule };
    const response = successResponse(data, 201);

    res.status(response.status.code).json(response);
});

const deleteSchedule = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const teacher = req.user._id;

    const schedulerExists = await Scheduler.findOne({ _id: id, isActive: true });
    if (!schedulerExists) {
        return next(createError(`Cannot find schedule to delete`, 400));
    }

    const deleteSchedule = await Scheduler.findOneAndUpdate(
        { _id: id, isActive: true },
        { isActive: false, updatedBy: teacher },
        { new: true, runValidators: true }
    );

    const response = successResponse({ delete: !deleteSchedule.isActive, id });
    res.status(response.status.code).json(response);
});

const getSchedules = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    // const schedules = await Scheduler.find({ isActive: true, subject: id });
    const schedules = await Scheduler.aggregate([
        {
            $match: { isActive: { $eq: true }, subject: { $eq: new mongoose.Types.ObjectId(id as string) } },
        },
        {
            $project: {
                startTime: 1,
                endTime: 1,
                description: 1,
                link: 1,
            },
        },
        {
            $addFields: {
                date: {
                    $dateToString: {
                        format: "%Y-%m-%d",
                        date: "$startTime",
                    },
                },
            },
        },
        {
            $group: {
                _id: "$date",
                schedule: {
                    $push: {
                        startTime: "$startTime",
                        endTime: "$endTime",
                        description: "$description",
                        link: "$link",
                        date: "$date",
                    },
                },
            },
        },
        {
            $addFields: {
                startsAt: "$_id",
            },
        },
        {
            $project: {
                _id: 0,
            },
        },
    ]);
    res.status(200).json({ schedules });
});
export { addSchedule, deleteSchedule, getSchedules };
