import fs from "fs";
import util from "util";

export const readFilePromise = util.promisify(fs.readFile);
export const unlink = util.promisify(fs.unlink);
