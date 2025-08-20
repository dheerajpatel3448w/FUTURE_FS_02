import express, { urlencoded } from "express"
import { connectdb } from "./db/connectdb.js";
import router from "./routes/cart.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();

app.use(cors({
    origin: ["http://localhost:5173", `${process.env.frontend}`],
    credentials: true
}));
app.use(urlencoded({
         extended:true
}))
app.use(express.json());
app.use(cookieParser());
app.use("/", router);


connectdb().then(()=>{
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
})
