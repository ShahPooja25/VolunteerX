import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token; // Get token from cookies

        // Check if token exists
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }

        // Attach userId to the request object to access in controllers
        req.id = decoded.userId;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
}

export default isAuthenticated;
