const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const { username, mail, password } = req.body;
        const existingUser = await User.exists({ mail: mail.toLowerCase() });
        if(existingUser) {
            return res.status(409).send('This email already exists');
        }
        const encryptedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            mail: mail.toLowerCase(),
            password: encryptedPassword
        });
        
        const token = jwt.sign({
            userId: user._id,
            mail
        }, process.env.TOKEN_KEY,
        {
            expiresIn: '7d'
        }
        )

        res.status(201).json({
            userDetails: {
                mail: user.mail,
                token: token,
                username: user.username
            }
        })
        
    } catch (err) {
        return res.status(400).send('Registeration could not be completed')
    }
}

const login = async (req, res) => {
    try {
        const { mail, password } = req.body;
        const user = User.findOne({ mail: mail.toLowerCase() })
        if(user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({
                userId: user._id,
                mail
            }, process.env.TOKEN_KEY,
            {
                expiresIn: '7d'
            }
            )    
            return res.status(200).json({
                userDetails: {
                    mail: user.mail,
                    token,
                    username: user.username
                }
            })
        }
        res.status(400).send("Invalid email or password please try again")
    } catch (err) {
        return res.status(400).send('Something went wrong please try again later')
    }
}

module.exports =  {
    register,
    login
}