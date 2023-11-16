import express from "express";
import { deleteUser, test } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import { updateUser } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/test", test);
userRouter.post("/update/:id", verifyToken, updateUser);
userRouter.delete("/delete/:id", verifyToken, deleteUser);

export default userRouter;
