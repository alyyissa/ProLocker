import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { SignupDto } from './dto/signup.dto';
import * as bcrypt from 'bcryptjs'
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        private readonly jwtService: JwtService
    ){}

    async signup(signupDto: SignupDto){
        const exists = await this.userRepo.findOne({where: {email: signupDto.email}});

        if(exists) throw new ConflictException('Wrong Cardentails');

        const hashed = await bcrypt.hash(signupDto.password, 10);

        const newUser = this.userRepo.create({
            firstName: signupDto.firstName,
            lastName: signupDto.lastName,
            email: signupDto.email,
            password: hashed
        })

        await this.userRepo.save(newUser)

        const tokens = await this.getToken(newUser.id, newUser.email)

        await this.updateRefreshToken(newUser.id, tokens.refreshToken)

        return {user: {id: newUser.id, email: newUser.email}, ...tokens}
    }

    async login(loginDto: LoginDto){
        const user = await this.userRepo.findOne({where: {email: loginDto.email}})
        if(!user) throw new NotFoundException('Wrong Cardintails')

        const valid = await bcrypt.compare(loginDto.password, user.password)
        if(!valid) throw new NotFoundException('Wrong Cardintails')

        const tokens = await this.getToken(user.id, user.email)

        await this.updateRefreshToken(user.id, tokens.refreshToken)

        return {user: {id: user.id, email: user.email}, ...tokens}
    }

    async getToken(userId:number, email:string){
        const payload = {sub: userId, email}

        const accessToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_ACCESS_SECRET,
            expiresIn: process.env.JWT_ACCESS_EXPIRES as any
        });
        const refreshToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: process.env.JWT_REFRESH_EXPIRES as any
        });

        return {accessToken, refreshToken}
    }

    async updateRefreshToken(userId: number, refreshToken:string){
        const hashed = await bcrypt.hash(refreshToken,10)

        await this.userRepo.update(userId, {
            refreshToken: hashed
        })
    }
}
