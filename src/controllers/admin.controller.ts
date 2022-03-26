import User from "../models/User";
import asyncWrapper from "../middlewares/asyncWrapper";
import successResponse from "../response/Success";

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

export { addAdmin };
