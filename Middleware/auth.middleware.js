import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token; // Read JWT from cookies

    if (!token) {
        return res.status(403).json({ message: "Access Denied: No Token Provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY); 
        console.log(decoded);
        req.user = decoded; // RETURN ID
        next(); // Continue to protected route
    } catch (error) {
        res.status(401).json({ message: "Invalid Token" });
    }
};
