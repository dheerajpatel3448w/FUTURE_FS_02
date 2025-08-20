import express from 'express';
import { connectdb } from './db/connectdb.js';
import cookieParser from 'cookie-parser';
import router from './routes/product.route.js';
import router2 from './routes/rating.route.js';

import cors from 'cors';

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

app.use('/', router);
app.use('/', router2);


connectdb().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
}).catch((error) => {
    console.error("Database connection failed:", error);
});
