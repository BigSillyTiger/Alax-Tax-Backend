import { CorsOptions } from "cors";
import allowedOrigins from "./allowedOrigins";

const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            const msg =
                "The CORS policy for this site does not allow access from the specified Origin.";
            callback(new Error(msg), false);
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
};

export default corsOptions;
