import express from "express";
import expressProxy from "express-http-proxy";
import cors from "cors";
const app = express();

app.use(cors({
    origin: ["http://localhost:5173",`${process.env.frontend}`],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/user", expressProxy(process.env.Auth));
app.use(
  "/product",
  expressProxy(process.env.product, {
    proxyReqBodyDecorator: function (bodyContent, srcReq) {
      return bodyContent;
    },
    limit: "50mb"  // 👈 ye important hai
  })
);
app.use("/cart", expressProxy(process.env.cart));
app.use("/order", expressProxy(process.env.order));

// Root test route


app.listen(process.env.PORT, () => {
    console.log(`✅ Gateway running at http://localhost:${process.env.PORT}`);
});
