import multer, { DiskStorageOptions, Multer, StorageEngine } from "multer";
import createError from "../response/fail";
import { UPLOAD_DIRECTORY } from "../constants/multerFeatures.constant";

const diskStorageOprions = (role: string, fileName: string): DiskStorageOptions => {
    const uploadPath = `${UPLOAD_DIRECTORY}/${role}`;
    return {
        destination: (req, file, cb) => {
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            const ext = file.mimetype.split("/")[1];
            console.log(ext);
            const name = fileName.replace("/", "").replace(".", "");
            cb(null, `${role}-${name}-${Date.now()}.${ext}`);
        },
    };
};

const multerForCsv = (storage: StorageEngine): Multer => {
    return multer({
        storage,
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.startsWith("text/csv")) {
                cb(createError("Invalid file type", 400));
            } else {
                cb(null, true);
            }
        },
    });
};

export { diskStorageOprions, multerForCsv };
