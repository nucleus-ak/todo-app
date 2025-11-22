const jwt = require('jsonwebtoken');
const JWT_STRING = "amankumar";

function auth(req, res, next) {
    const token = req.headers.token;
    const decodedData = jwt.verify(token, JWT_STRING);
    if(decodedData) {
        console.log(decodedData);
        req.userId = decodedData.id;
        next();
    } else {
        res.status(403).json({
            msg: "Invalid Credentials -- Invalid Token"
        });
    }
}

module.exports = {
    auth,
    JWT_STRING
}