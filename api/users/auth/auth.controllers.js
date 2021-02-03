const Joi = require('joi');
const userModel = require('../users.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const avatarGenerator = require('../../utils/avatargenerator');
const uuid = require('uuid');
const sendEmail = require('../../utils/sendEmail');

class AuthControllers {
    async createUser (req,res,next) {
        try {
            const {email, password} = req.body;
            const passwordHash = await bcrypt.hash(password, 4);
            const existingUser = await userModel.findUserByEmail(email);
            if(existingUser) {
                return res.status(409).send({message: "Email in use"});
            }
            const avatar = await avatarGenerator();
            const avatarLink = `http://localhost:3000/images/${avatar}`;
            const {
                _id: id,
                email: userEmail,
                subscription,
                token,
                avatarURL,
              } = await userModel.create({
                email,
                password: passwordHash,
                avatarURL: avatarLink,
              });

              const verificationToken = uuid.v4();

              await user.createVerificationToken(verificationToken);

              await sendEmail(user.email, verificationToken);

            return res.status(201).send({
                user: {
                    email: userEmail,
                    subscription,
                    avatarURL,
                }
            })
        } catch (error) {
            next(error);
        }
    }

    async login (req,res,next) {
        try {
            const {email, password} = req.body;
            const user = await userModel.findUserByEmail(email);
            if(!user) {
                return res.status(401).send('Authenticaction failed');
            }
            const validPassword = await bcrypt.compare(password, user.password);
            if(!validPassword) {
                return res.status(401).send('Authenticaction failed');
            }
            const token = await jwt.sign({id: user._id}, process.env.JWT_SECRET, {
                expiresIn: 2 * 24 * 60 * 60,
            });
            await userModel.updateToken(user._id, token);
            return res.status(200).json({token});

        } catch (error) {
            next(error);
        }
    }
    
    async logout(req,res,next) {
        try {
            const user = req.user;
            await userModel.updateToken(user._id, null);
            return res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    async verifyEmail(req,res,next) {
        try {
            const {verificationToken} = req.params;
            const userToVerify = await userModel.findByVerificationToken(verificationToken);
            if(!userToVerify) {
                return res.send(404).send("User not found");
            }
            await userModel.verifyUser(userToVerify);
            return res.status(200).send('Verified');
        } catch (error) {
            next(error);
        }
    }

    validateCreateUser(req,res,next) {
        const createUserRules = Joi.object({
            email: Joi.string().email().min(1).required(),
            password: Joi.string().min(6).required(),
        });
        const result = createUserRules.validate(req.body);

        if(result.error) {
        return res.status(400).json({ message: result.error });
        }
        next();
    }
}

module.exports = new AuthControllers();