const userModel = require('../users/users.model');
const {UnauthorizationError} = require('../helpers/errors.constructors');

exports.authorize = async function (req, res,next) {
    try {
        const authorixationHeader = req.get('Authorization');
        const token = authorixationHeader.replace("Bearer ", "");
        let userId;
        try {
            const userId = await jwt.verify(token, process.env.JWT_SECRET).id;
        } catch (error) {
            next(new UnauthorizationError("User not authorizated"));
        }
        const user = await userModel.findById(userdId);
        if(!user || user.token !== token) {
            throw new UnauthorizationError();
        }
        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        next(error);
    }
} 
 