
import jwt from "jsonwebtoken";
import registers from "../models/register.model.js";
import event from "../models/event.model.js";
import EventRegistration from "../models/eventRegistration.js";
import bcrypt from "bcrypt"
import { validationResult } from "express-validator";


export const signUp = async (req, res, next) => {

    let error = validationResult(req);

    if (error.isEmpty()) {
        try {
            const { rollNumber, name, email, password } = req.body;

            // Find rollNumber & email to conterfm it
            let user = await registers.findOne({ where: { rollNumber } });
            // ager user ni mile toh
            if (!user) {
                return res.status(400).json({ message: "PLEASE CHECK YOUR EMAIL AND ROLL NUMBER" });
            }
            else {
                // ager value null mile toh
                if (!user.password || !user.name) {


                    //bcrypt
                    let saltKey = bcrypt.genSaltSync(10)

                    let hashedPassword = await bcrypt.hash(password, saltKey);


                    //FOR EVERY LINK UNIQUE
                    const token = jwt.sign({ email }, process.env.JWT_KEY);


                    const verificationLink = `http://localhost:3000/api/verify/${token}`
                    const mailOptions = {
                        from: `"EVENT MANEGMENT" <${process.env.EMAIL_USER}>`,
                        to: email,
                        subject: "VERIFY YOUR EMAIL ",
                        html: `<p>Click the link below to verify your email: FOR STUDENT</p>
                                        <a href="${verificationLink}">${verificationLink}</a>`,
                    }

                    await transport.sendMail(mailOptions);


                    await registers.update(
                        { name, email, password: hashedPassword, isVerified: "false" }, // udate the filed
                        { where: { rollNumber } }
                    );

                    return res.status(200).json({
                        result: `STUDENT CREATED: ${email}`,
                    });
                }
                else {
                    // If user is already registered
                    return res.status(400).json({ message: "Already Registered" });
                }
            }

        } catch (error) {
            res.status(500).json({ message: `Server Error Due to ${error}` });
        }
    }
    else {
        res.status(400).json({ msg: "Bad request", error: error })
    }

}

export const signInn = async (req, res, next) => {

    let error = validationResult(req);

    if (error.isEmpty()) {
        try {
            const { email, password } = req.body;
            const role = "student"

            let user = await registers.findOne({ where: { email, role } });
            if (!user) return res.status(400).json({ message: "Not Registered Creadencial" })

            if (!user.isVerified) {
                return res.status(403).json({ message: "Please verify your email first" });
            }

            else {

                const ismatch = await bcrypt.compare(password, user.password);
                // console.log(ismatch);

                if (ismatch) {
                    const token = jwt.sign(
                        { id: user.rollNumber },
                        process.env.JWT_KEY,
                    );
                    // SENDING TOKEN IN FORM OF COOKIES
                    res.cookie("token", token, {
                        httpOnly: true,//xss Atacks
                    })


                    // return res.status(200).json({  Result:'Sign Inn success' ,})
                    return res.status(200).json({ Route_get: "/student/student-dashBoard` " })
                }
                else { return res.status(400).json({ message: `password is Wroung` }) }
            }

        } catch (error) {
            res.status(500).json({ message: `Server Error Due to ${error}` })
        }
    }
    else {
        res.status(400).json({ msg: "bad request", error })
    }
}

export const dashboard = async (req, res, next) => {

    try {

        const events = await event.findAll({})

        // res.cookie("eventId", events.id)


        res.status(200).json({ RESULT: "Success Deshboard Render", Onclick_On_ANYTASK_GET_REQ: `/user/event=`, EVENT: events })

    } catch (error) {
        res.status(500).json({ Erro: `Server Error Due to${error}` })
    }
}

export const Oneevent = async (req, res, next) => {

    try {
        const eventId = req.params.eventId;

        let Event = await event.findOne({ where: { id: eventId } });


        res.status(200).json({ FilledForm_Router_Post_Req: '', Event });
    } catch (error) {
        res.status(500).json({ ERROR: `Server Error Due to ${error}` })
    }
}

export const eventRegister = async (req, res, next) => {

    let error = validationResult(req);

    if (error.isEmpty()) {

        try {

            const { studentName, studentEmail } = req.body;
            const eventId = req.params.eventId;

            const token = req.cookies.token;
            if (!token) {
                return res.status(401).json({ message: "Unauthorized: SIGNINN FIRST" });
            }


            // Decode token to get faculty ID
            const decoded = jwt.verify(token, process.env.JWT_KEY);
            // console.log(decoded);

            const rollNumber = decoded.id; // Extracting faculty ID from token


            let existingRegistrations = await EventRegistration.findAll({ where: { studentName, eventId } });

            if (existingRegistrations.length > 0) {
                return res.status(400).json({ result: 'ALREADY REGISTERED' });
            }


            let event = await EventRegistration.create({ studentName, studentEmail, eventId, rollNumber })

            res.status(200).json({ result: { event } })
        } catch (error) {
            res.status(500).json({ result: `Error Due to ${error}` })
        }
    }
    else {
        res.status(400).json({ msg: "Bad Request", error })
    }
}