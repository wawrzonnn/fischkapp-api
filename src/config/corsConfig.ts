import { CorsOptions } from 'cors';

const allowedOrigins = [process.env.ALLOWED_ORIGIN || ''];

const corsOptions: CorsOptions = {
    origin: function(origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = `Origin ${origin} not allowed by CORS`;
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
};

export default corsOptions;