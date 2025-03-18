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
    }
}

module.exports = new UserService();
