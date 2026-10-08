const jwt = require("jsonwebtoken");
const User = require("./models/User");

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ message: "No Token" });
        }

        const decoded = jwt.verify(token, "mysecretkey");

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: "User no longer exists" });
        }

        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({ message: "Invalid Token" });
    }
};

module.exports = auth;