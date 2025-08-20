import express from "express";
import cookieParser from "cookie-parser";
import { connectdb } from "./db/connectdb.js"
import router from "./routes/order.route.js";
import cors from "cors";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173", `${process.env.frontend}`],
    credentials: true
}));
app.use("/", router);





connectdb().then(()=>{
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
})