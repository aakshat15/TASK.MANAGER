import express from 'express';
import AdminRouter from "./routers/admin.router.js";
import TaskRouter from "./routers/task.router.js";
import bodyParser from 'body-parser';
import session from "express-session";
const app = express();


app.set("view engine" ,"ejs");

app.use(express.static("./public"))
app.use(bodyParser.urlencoded({ extended : true}));
app.use(bodyParser.json());
app.use(session({secret:"dflsfjeoriewruoeuxvnmc",resave:true,saveUninitialized: true}));

app.use("/admin" , AdminRouter);
app.use("/task",TaskRouter);


app.listen(5000, ()=> {
    console.log("server started on 5000");
})