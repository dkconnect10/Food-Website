import express, { json } from "express";
import dotenv from "dotenv";
import connectDB from '../src/db/connectDB.js'
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(json());
app.use(cookieParser());

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public"));



dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("before listen App error", error);
      throw error;
    });
    app.listen(process.env.PORT || 4040, () => {
      console.log(`Server is running at port  : ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MONGO DB Connection failed  !! : ", error);
  });

// import router
import userRouter from "./router/userRouter.js";
import restaurantRouter from "./router/restaurantRouter.js";
import categoryRouter from "./router/categoryRouter.js";
import foodRouter from "./router/foodRouter.js";
import orderRouter from "./router/orderRouter.js";

// setup router
app.use("/api/v1/user", userRouter);
app.use("/api/v1/restaurant", restaurantRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/food", foodRouter);
app.use("/api/v1/order", orderRouter);

export { app };
