import express from "express";
import expressProxy from "express-http-proxy";
import cors from "cors";
const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/user", expressProxy("http://localhost:5001"));
app.use(
  "/product",
  expressProxy("http://localhost:5002", {
    proxyReqBodyDecorator: function (bodyContent, srcReq) {
      return bodyContent;
    },
    limit: "50mb"  // 👈 ye important hai
  })
);
app.use("/cart", expressProxy("http://localhost:5003"));
app.use("/order", expressProxy("http://localhost:5004"));

// Root test route


app.listen(process.env.PORT, () => {
    console.log(`✅ Gateway running at http://localhost:${process.env.PORT}`);
});
