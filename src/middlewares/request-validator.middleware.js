// to validate request 
import HttpResponseCode from "../constants/http-status-code.contants.js";
import HttpResponse from "../constants/response-status.contants.js";

const bodyValidator = (schemaDto) => {
    return async (req, res, next) => {
        try {
            let data = req.body;

            // Check for empty body
            if (!data || Object.keys(data).length === 0) {
                return next({
                    status: HttpResponseCode.BAD_REQUEST,
                    message: "Request body cannot be empty",
                    statusCode: HttpResponse.validationFailed,
                    detail: { body: "No data provided" }
                });
            }

            // validate your data
            const validatedData = await schemaDto.validateAsync(data, { abortEarly: false });
            
            // Attach validated data to request
            req.validatedData = validatedData;
            
            next();
            
        } catch (exception) {
            let msg = {};
            
            // Check if exception has details (Joi error)
            if (exception.details) {
                exception.details.map((error) => {
                    msg[error.context.label] = error.message;
                });
            } else {
                // Generic error
                msg.error = exception.message;
            }
            
            next({
                detail: msg,
                statusCode: HttpResponse.validationFailed,
                message: "Validation Failed",
                status: HttpResponseCode.BAD_REQUEST
            });
        }
    };
};

export { bodyValidator };