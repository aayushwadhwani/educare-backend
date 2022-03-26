import User from "../models/User";
import asyncWrapper from "../middlewares/asyncWrapper";
import createError from "../response/fail";
import successResponse from "../response/Success";

const login = asyncWrapper(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, isActive: true });
    if (!user) {
        const message = `Invalid credentials`;
        return next(createError(message, 400));
    }

    const isPasswordRight = await user.matchPassword(password);
    if (!isPasswordRight) {
        const message = `Invalid credentials`;
        return next(createError(message, 400));
    }

    const data = {
        canLogIn: true,
        name: user.name,
        email: user.email,
        token: user.generateJWT(),
    };
    const response = successResponse(data);
    res.status(200).json(response);
});

export { login };
