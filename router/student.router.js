import express from "express";
import { signUp , signInn , dashboard , Oneevent , eventRegister} from "../controller/student.controller.js" 
import { verifyToken } from "../Middleware/auth.middleware.js";
import { body } from "express-validator";

const studentRouter = express.Router();

// //SIGNUP SIGNINN
studentRouter.post("/student-signUp" ,
        body("rollNumber" , "Fill the rollNumber").notEmpty(),
        body("email", "valid Email Enter").isEmail(),  //IS EMAIL OR NOT
        body("email", "please enter Email").notEmpty(), // EMAIL EMPTY CHECK
        body("password", "Please enter password").notEmpty(),   //PASSWORD EMPTY CHECK
        body("password", " min:2 or max : 10 char in password").isLength({ min: 2, max: 10 }), //LENGTH OF PASSWORD
        body("name", "Please Enter name").notEmpty()
    , signUp);


studentRouter.post("/student-signInn" ,
    body("email" , "Fill the email").notEmpty(),
    body("email", "valid Email Enter").isEmail(), 
    signInn);

// // DASHBOARD
studentRouter.get("/student-dashBoard" , verifyToken , dashboard);

//  EVENT
studentRouter.get("/event/:eventId" , verifyToken , Oneevent)
studentRouter.post("/event/register/:eventId" ,
    body("studentEmail" , "Fill the email").notEmpty(),
    body("studentEmail", "valid Email Enter").isEmail(), 
    body("studentName" , "PLEASE FILL NAME").notEmpty(),
    verifyToken , eventRegister )

export default studentRouter;