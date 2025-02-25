import Dotenv from "dotenv";
import jwt from "jsonwebtoken";
import register from "../models/register.model.js";
import express from "express";

Dotenv.config();

const verifyRouter = express.Router();

verifyRouter.get("/verify/:token", async (req, res) => {
    try {
        console.log("Running.....");
        const token = req.params.token;

        
        // Verify the token using the secret
        const decoded = jwt.verify(token,  process.env.JWT_KEY ||secratKey123  );

        // Extract the email from the decoded token
        const email = decoded.email;

        // Find the user by email
        let user = await register.findOne({where: { email: email }  });

        if (!user) {
            return res.status(400).json({ message: "Invalid verification link" });
        }
        else{
            // Update user's verification status
            await register.update({ isVerified: true }, { where: { email } });
            res.send("<h1>Email Verified Successfully! You can now log in.</h1>");
        }


    } catch (error) {
        console.error(error);
        res.status(400).send(`<h1> or Expired Token${error}</h1>`);
    }
});

export default verifyRouter;
