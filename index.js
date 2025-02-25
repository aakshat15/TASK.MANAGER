import express from "express";
import bodyParser from "body-parser"

import dotenv from "dotenv";
import cookieParser from "cookie-parser";


import facultyRouter from "./router/faculty.router.js";
import studentRouter from "./router/student.router.js";
import verifyRouter from "./router/verify.router.js";

import sequelize from "./db.ConfigSequelize/connection.js";
import assosiationEventndDetailsModel from "./models/Association/EventndRegisters.model.js";
import assisationEventRegistration from "./models/Association/assisation.eventRegistration.js";


const app = express();

app.use(bodyParser.urlencoded({ extended : true}));
app.use(bodyParser.json());
app.use(cookieParser());


// Use .env variables
dotenv.config();
const PORT = process.env.PORT;



sequelize.sync().then(() => {
    console.log("DATABASE CONNECTED");
}).catch((err) => {
    console.log(`ERROR DUE TO ${err}`);
});

//ROUTERSS
app.use("/student" , studentRouter);
app.use("/faculty" , facultyRouter);
app.use("/api" , verifyRouter);


app.listen(PORT , () => {
    console.log(`http://localhost:${PORT}}`);
})