import {Router} from "express";
import { registerUser } from "../controllers/user.controller.js";
const router = Router();

// Handling POST request t to http:localhost/api/v1/users/register
router.route("/register").post(registerUser)

export default router