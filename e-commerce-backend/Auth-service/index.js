import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import router from './routes/user.routes.js';
import router2 from './routes/address.route.js';
import { connectdb } from './db/connectdb.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:5173', `${process.env.frontend}`],
    credentials: true
}));


app.use('/', router);
app.use('/',router2);


connectdb().then(()=>{
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
})
});