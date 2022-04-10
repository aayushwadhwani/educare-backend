import S3Service from "../utils/S3Features";
import asyncWrapper from "../middlewares/asyncWrapper";
import fs from "fs";
import util from "util";

const addAssignment = asyncWrapper(async (req, res, next) => {
    const s3 = new S3Service();
    const readFilePromise = util.promisify(fs.readFile);
    const fileContent = await readFilePromise("uploads/class/class-class-1649435493784.csv");
    const aa = await s3.putObject("temp.csv", fileContent);
    res.json(aa);
});

export { addAssignment };
