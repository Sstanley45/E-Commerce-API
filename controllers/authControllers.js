import { StatusCodes } from "http-status-codes";
import User from "../models/User.js";
import {BadRequestError, UnauthenticatedError} from '../errors/index.js'
import { attachCookiesToResponse, createTokenUser } from "../utils/index.js";


const register = async (req, res) => {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
        throw new BadRequestError('please fill all values!')
    }
    const userAlreadyExist = await User.findOne({ email })
    if (userAlreadyExist) {
        throw new BadRequestError('user already exists')
    }

    const isFirstAccount = await User.countDocuments({}) === 0;
    const role = isFirstAccount ? 'admin' : 'user';

    const user = await User.create({ name, email, password, role })
    const tokenUser = createTokenUser(user)
    
    attachCookiesToResponse({ res, tokenUser})
}

const login = async (req, res) => {
    const { email, password } = req.body 
    if (!email || !password) {
        throw new BadRequestError('Please fill all values')
    }
    const user = await User.findOne({ email })
    if (!user) {
        throw new UnauthenticatedError('Invalid Credentials')
    } 
    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
         throw new UnauthenticatedError("Invalid Credentials");
    }

   const tokenUser = createTokenUser(user);

   attachCookiesToResponse({ res, tokenUser }); 
}


const logout = async (req, res) => {
    res.cookie("token", "random", {
      httpOnly: true,
      expiresIn: new Date(Date.now()), 
    });
    res.status(StatusCodes.OK).json({msg : 'user logged out!'})
}

export { register, login, logout } 