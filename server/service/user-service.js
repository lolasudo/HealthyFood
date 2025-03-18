const userModel = require("../models/user-model");
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require("./token-service");
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error'); // Убедитесь в правильности пути

class UserService {
    async registration(email, password) {
        const candidate = await userModel.findOne({ email });
        if (candidate) {
            throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const activationLink = uuid.v4();

        const user = await userModel.create({ email, password: hashedPassword, activationLink });

        try {
            await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);
        } catch (error) {
            console.error("Ошибка отправки письма:", error);
        }
        
        const userDto = new UserDto(user); // id, email, isActivated
        const tokens = tokenService.generateTokens({ ...userDto });

        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return { ...tokens,user: userDto}
        
    }
    async activate(activationLink){
        const user= await userModel.findOne({activationLink})
        if(!user){
            throw ApiError.BadRequest('неккоректная ссылка активации')
        }
        user.isActivated=true;
        await user.save();

    }
    async login(email,password){
        const user = await userModel.findOne({email})
        if (!user){
            throw ApiError.BadRequest('Пользователь с таким email не сущесвтует')
        }
        const isPassEquals=await bcrypt.compare(password,user.password);
        if (!isPassEquals){
            throw ApiError.BadRequest('неверный пароль');
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return { ...tokens,user: userDto}
        
    }
    async logout(refreshToken){
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken){
        if (!refreshToken){
            throw ApiError.UnauthorizedError();
        }
        const userData=tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (userData|| !tokenFromDb){
            throw ApiError.UnauthorizedError();
        }
        const user = await UserModel.findById(userData.id)
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);//вынести в отдел функцию

        return { ...tokens,user: userDto}
        
    }
}

module.exports = new UserService();
