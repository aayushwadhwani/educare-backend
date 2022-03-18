import app from "./app";
import connectDB from "./config/db";

const mongoUri = process.env.MONGO_URI;

const start = async () => {
    try {
        await connectDB(mongoUri as string);
    } catch (err) {
        console.log(err);
    }
    app.listen(app.get("port"), () => {
        console.log(`Server is running on http://localhost:${app.get("port")}`);
    });
};

start();
