import { authentication } from "../middleware/authentication.js";
import { validate } from "../validation/validation.js";
import { enumTypeInput } from "../utils/enums.js";
import { removePic } from "../utils/helper.js";
import fsExtra from "fs-extra";
import fileProcessing from "../utils/fileprocissing.js";

const execute = (fun) => (req, res, next) => {
  Promise.resolve(fun(req, res, next)).catch(async (error) => {
    if (req.files)
      await Promise.all(
        req.files.map((item) => {
          fileProcessing.deleteFile(item.filename);
        })
      );
    if (req.file && (await fsExtra.pathExists(req.file.path))) {
      try {
        await removePic(req.file.path);
      } catch (error) {}
    }
    if (error.code == "ENOENT") {
    } else next(error);
  });
};
export const parserJson = (data) =>
  process.env.DATABASE != "quizس" ? data : JSON.parse(data);

export { authentication, execute, validate, enumTypeInput as type };
