import Role from "../models/Role";
import asyncWrapper from "../middlewares/asyncWrapper";
import successResponse from "../response/Success";
import apiFeatures from "../utils/ApiFeatures";
import createError from "../response/fail";

const addRole = asyncWrapper(async (req, res, next) => {
    const { _id: createdBy } = req.user;
    const { name } = req.body;
    const toAdd = {
        name,
        createdBy,
        updatedBy: createdBy,
    };

    const role = await Role.create(toAdd);
    const data = { role };
    const response = successResponse(role, 201);
    res.status(response.status.code).json(response);
});

const getAllRole = asyncWrapper(async (req, res, next) => {
    const master = "role";
    const { hitsLimit, pageNumber, query } = new apiFeatures(Role.find({ isActive: true }), req.query)
        .search(["name"])
        .limitFields(master)
        .populateUpdatedBy()
        .sort()
        .paginate();

    const roles = await query.query;
    const data = { hitsLimit, pageNumber, count: roles.length, roles };
    const response = successResponse(data);
    res.status(response.status.code).json(response);
});

const getSingleRole = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const role = await Role.findOne({ _id: id, isActive: true });
    if (!role) {
        const message = `Cannot find role with id: ${id}`;
        return next(createError(message, 400));
    }
    const response = successResponse({ role });
    res.status(response.status.code).json(response);
});

const deleteRole = asyncWrapper(async (req, res, next) => {
    const { _id: updatedBy } = req.user;
    const { id } = req.params;
    const role = await Role.findOne({ _id: id, isActive: true });
    if (!role) {
        const message = `Cannot find role with id: ${id}`;
        return next(createError(message, 400));
    }

    const deleteRole = await Role.findOneAndUpdate(
        { _id: id, isActive: true },
        { isActive: false, updatedBy },
        { runValidators: true, new: true }
    );

    const response = successResponse({ deleted: !deleteRole.isActive, id: deleteRole._id });
    res.status(response.status.code).json(response);
});

export { addRole, getAllRole, getSingleRole, deleteRole };
