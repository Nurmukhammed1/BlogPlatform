const jwt = require('jsonwebtoken');
const UserModel = require('../Models/User'); // Убедись, что путь к модели верный

module.exports = async (req, res, next) => {
    try {
        const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
        if (!token) {
            return res.status(403).json({ message: "No permission" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await UserModel.findById(decoded._id);

        if (!user) {
            return res.status(403).json({ message: "User not found" });
        }

        // Проверяем refreshToken (из куки или заголовка)
        const refreshToken = req.headers['x-refresh-token'] || req.cookies?.refreshToken;
        if (!refreshToken || refreshToken !== user.refreshToken) {
            return res.status(403).json({ message: "Session expired. Please log in again." });
        }

        req.userId = decoded._id;
        next();
    } catch (e) {
        return res.status(403).json({ message: "No permission" });
    }
};
