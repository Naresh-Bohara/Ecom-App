import multer from "multer";
import HttpResponseCode from "../constants/http-status-code.contants.js";
import HttpResponse from "../constants/response-status.contants.js";

const storage = multer.memoryStorage();

const uploadFile = () => {
    const typeFilter = (req, file, cb) => {
        const ext = file.originalname.split(".").pop().toLowerCase();
        if(['jpg', 'jpeg', 'png', 'svg', 'bmp', 'webp'].includes(ext)){
            cb(null, true)
        } else {
            cb({status: HttpResponseCode.BAD_REQUEST, message: "File format not supported", code: HttpResponse.validationFailed})
        }
    }
    return multer({
        storage: storage,
        fileFilter: typeFilter,
        limits: { fileSize: 5 * 1024 * 1024 }
    });
}

export { uploadFile };