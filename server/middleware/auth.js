const jwt = require('jsonwebtoken');

const config = process.env

const verifyToken = (req, res, next) => {
    let token = req.body.token || req.query.token || req.headers['authorization'];
    

}