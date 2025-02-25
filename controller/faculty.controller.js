import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from "bcrypt"
import { validationResult } from "express-validator";
// import transport  from "../transporterMailer.js";
import registers from "../models/register.model.js";
import event from "../models/event.model.js";
import EventRegistration from "../models/eventRegistration.js";
import nodemailer from "nodemailer"
import dotenv from "dotenv";

dotenv.config();
const transport = nodemailer.createTransport({
        service : "gmail" , 
        auth : {
            user : process.env.EMAIL_USER,
            pass : process.env.EMAIL_PASS,
        },
});


export const createFaculty = async (req, res, next) => {

    let errors = validationResult(req);
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

    if (errors.isEmpty()) {

        try {
            //facultyNumber THEN THE PLACE OF ROLLNUMBER
            const { facultyNumber, name, email, password } = req.body;
            const role = "faculty";



            // Check if faculty exists in register table
            let faculty = await registers.findOne({ where: { rollNumber: facultyNumber, email } });

            if (!faculty) {
                return res.status(400).json({ message: `Please enter the correct FacultyNumber: ${facultyNumber}` });
            } else {

                //CReating bcrept password
                let saltKey = bcrypt.genSaltSync(10);
                const hashedPassword = await bcrypt.hash(password, saltKey);
                // console.log(hashedPassword);

                
                //FOR EVERY LINK UNIQUE
                const token = jwt.sign({ email }, process.env.JWT_KEY);

                
                const verificationLink = `http://localhost:3000/api/verify/${token}`
                const mailOptions = {
                    from: `"EVENT MANEGMENT" <${process.env.EMAIL_USER}>`,
                    to: email,
                    subject: "VERIFY YOUR EMAIL ",
                    html: `<p>Click the link below to verify your email:</p>
                    <a href="${verificationLink}">${verificationLink}</a>`,
                }
                
                await transport.sendMail(mailOptions);
                
                // console.log("run");
                
                // from null UPdate faculty in Detalis table
                faculty = await registers.update(
                    { name, password: hashedPassword, isVerified: "false" , role },
                    { where: { rollNumber: facultyNumber } }
                );

                return res.status(200).json({
                    result: ` Verification email sent to ${email}. 
                    Please verify your account.`,
                });
            }
        } catch (err) {
            return res.status(500).json({ message: `Faculty not registered due to: ${err.message}` });
        }
    }
    else {
        return res.status(400).json({ error: "Bad request", errors: errors.array() });
    }

}

export const facultySignInn = async (req, res, next) => {

    let error = validationResult(req);

    if (error.isEmpty()) {

        try {
            const { email, password } = req.body;
            const role = "faculty";

            let user = await registers.findOne({ where: { email, role } });


            if (!user) return res.status(400).json({ message: "Not Registered Creadencial" })

            if (!user.isVerified) {
                return res.status(403).json({ message: "Please verify your email first" });
            }
            
            const isMatch = await bcrypt.compare(password, user.password);

            if (isMatch) {
                ///faculty/createEvent/${user.id}
                const token = jwt.sign(
                    { id: user.id, }, // MEXIEDWITH:ID
                    process.env.JWT_KEY,
                );
                // SEND TOKEN AS A COOKIE
                res.cookie("token", token, {
                    httpOnly: true, // Protects from XSS attacks
                });


                return res.status(200).json({ Result: 'Sign Inn success', Use_with_getreqest: `/faculty/faculty-dashBoard/` });
            }
            else { return res.status(400).json({ message: `password is Wroung` }) }

        } catch (error) {
            res.status(500).json({ message: `Server Error Due to ${error}` })
        }
    }
    else {
        res.status(400).json({ request: "Bad Request", error: error.array() });
    }
}

export const dashBoard = async (req, res, next) => {
    const token = req.cookies.token;
    // extract the id from token
    const createdByfaculty = jwt.verify(token, process.env.JWT_KEY).id;
    console.log(createdByfaculty);

    // res.status(200).json({ RESULT: `SUCCESS AND DEASHBOARD RENDER` })
    res.status(200).json({ POST_EVENT_REQUEST: `/faculty/createEvent`, GET_MYEVENT_REQUEST: `/faculty/myEvents`, GET_ALL_REQUEST: "/faculty/AllEvents" })
}

export const createStudent = async (req, res, next) => {

    let error = validationResult(req);

    if (error.isEmpty()) {

        try {
            const rollNumber = `ROLL-${uuidv4().slice(0, 8)}`
            const { email } = await req.body;
            //    console.log(rollNumber);
            const userEmail = await registers.findOne({ where: { email } });
            if (userEmail) {
                res.status(400).json({ message: `Email is Already Registerd ${userEmail.email}` })
            }
            else {

                const faculty = await registers.create({
                    rollNumber, // Assign random roll number
                    email,
                    role: "student"
                });
                res.status(200).json({ message: `Register Success ${rollNumber}` })
            }
        } catch (error) {
            res.status(500).json({ message: `Error due to ${error}` })
        }
    }
    else {
        res.status(400).json({ Msg: "Bad Request", error: error.array() })
    }

}

export const createEvent = async (req, res, next) => {

    let error = validationResult(req);

    if (error.isEmpty()) {

        try {
            const { title, description, location, endDate } = req.body;

            // Extract token from cookies
            const token = req.cookies.token;
            if (!token) {
                return res.status(401).json({ message: "Unauthorized: No token provided." });
            }

            // Decode token to get faculty ID
            const decoded = jwt.verify(token, process.env.JWT_KEY);
            const createdByfaculty = decoded.id; // Extracting faculty ID from token

            console.log("Faculty ID:", createdByfaculty);

            // Check if the event already exists
            let existingEvent = await event.findOne({ where: { title, endDate } });
            if (existingEvent) {
                return res.status(400).json({ message: `Event already exists: ${title}` });
            }

            // Create a new event
            const newEvent = await event.create({ title, description, endDate, location, createdByfaculty });

            res.status(201).json({
                message: "Event Created Successfully",
                event: newEvent,
                dashboardURL: `/faculty/faculty-dashBoard/${createdByfaculty}`
            });

        } catch (error) {
            res.status(500).json({ message: `faculty not registerd due to ${error}` })
        }
    }
    else {
        return res.status(400).json({ error: "Bad request", errors: error.array() });
    }

}

export const myEvents = async (req, res, next) => {

    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided." });
        }

        // Decode token to get faculty ID
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const createdByfaculty = decoded.id; // Extracting faculty ID from token

        let events = await event.findAll({ where: { createdByfaculty } });
        if (events) return res.status(200).json({ AllEvents: events })
        else { res.json({ message: `Not have any events` }) }
    } catch (error) {
        res.status(500).json({ message: `ServerError due to ${error}` })
    }
}

export const allEvents = async (req, res, next) => {

    try {
        const events = await event.findAll({});
        if (events) return res.status(200).json({ SELECT_EVENT_FOR_StudentsDEtalis: "faculty/allEvents/:eventId", AllEvents: events })
        else { return res.json("NOT HAVE ANY EVENTS") }

    } catch (error) {
        res.status(500).json({ message: `SEVER ERROR DUE TO ${error}` })
    }


}

export const getDetails = async (req, res, next) => {

    try {

        const eventId = req.params.eventId;

        const student = await EventRegistration.findAll({ where: { eventId } })

        res.status(200).json({ mes: "SUCCESS", student })

    } catch (error) {
        res.status(500).json({ msg: `SERVER SIDE ERROR ${error}` })
    }
}