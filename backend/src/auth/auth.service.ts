import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { SignupDto } from './dto/signup.dto';
import * as bcrypt from 'bcryptjs'
import { LoginDto } from './dto/login.dto';
import { generateVerificationCode } from './utils';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        private readonly jwtService: JwtService,
        private readonly mailService: MailService
    ){}

    async signup(signupDto: SignupDto) {
    const exists = await this.userRepo.findOne({ where: { email: signupDto.email } });
    if (exists) throw new ConflictException('Email already exists');

    const hashed = await bcrypt.hash(signupDto.password, 10);
    const code = generateVerificationCode();

    const newUser = this.userRepo.create({
        firstName: signupDto.firstName,
        lastName: signupDto.lastName,
        email: signupDto.email,
        password: hashed,
        verificationCode: code,
        isVerified: false,
        resendCount: 0,
        lastResendAt: null,
        codeGeneratedAt: new Date()
    });

    await this.userRepo.save(newUser);

    await this.mailService.sendVerificationEmail(newUser.email, code);

    return { message: "Signup successful. Check your email for verification code." };
    }


    async login(loginDto: LoginDto){
        const user = await this.userRepo.findOne({where: {email: loginDto.email}})
        if(!user) throw new NotFoundException('Email or Password is wrong')

        if (!user.isVerified) {
        throw new UnauthorizedException("Email not verified");
        }

        const valid = await bcrypt.compare(loginDto.password, user.password)
        if(!valid) throw new NotFoundException('Email or Password is wrong')

        const tokens = await this.getToken(user.id, user.email)

        await this.updateRefreshToken(user.id, tokens.refreshToken)

        return {user: {id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName}, ...tokens}
    }

    async logout(userId: number){
        await this.userRepo.update(userId, {refreshToken: null})

        return { message: "Logged out"}
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

    async refresh(userId: number, refreshToken){
        const user = await this.userRepo.findOne({where: {id: userId}})
        if(!user || !user.refreshToken) throw new ForbiddenException("Acess Denied");

        const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
        if(!isValid) throw new ForbiddenException("Access Denied");

        const tokens = await this.getToken(user.id, user.email);

        await this.updateRefreshToken(user.id, tokens.refreshToken);

        return tokens;
    }

    async verifyEmail(email: string, code: string) {
    const user = await this.userRepo.findOne({ where: { email } });

    if (!user || user.verificationCode !== code) {
        throw new BadRequestException("Invalid verification code");
    }

    const now = new Date();
    if (!user.codeGeneratedAt) {
    throw new BadRequestException("No verification code found");
}
    const expiryTime = new Date(user.codeGeneratedAt);
    expiryTime.setMinutes(expiryTime.getMinutes() + 10);

    if (now > expiryTime) {
        throw new BadRequestException("Code expired, try again");
    }

    // mark user as verified
    user.isVerified = true;
    user.verificationCode = null;
    user.codeGeneratedAt = null;
    await this.userRepo.save(user);

    // generate tokens
    const tokens = await this.getToken(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
        message: "Account verified successfully",
        user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
        },
        ...tokens
    };
}





    async resendVerificationCode(email: string) {
        const user = await this.userRepo.findOne({ where: { email } });
        if (!user) throw new NotFoundException("User not found");
        if (user.isVerified) throw new BadRequestException("User already verified");

        const now = new Date();

        // Check resend limit
        if (user.resendCount >= 2) {
            throw new ForbiddenException("Resend limit reached. Contact support.");
        }

        // Check 1-minute cooldown
        if (user.lastResendAt) {
            const diffMs = now.getTime() - user.lastResendAt.getTime();
            const diffMinutes = diffMs / 1000 / 60;

            if (diffMinutes < 1) {
            const waitSeconds = Math.ceil(60 - diffMinutes * 60);
            throw new BadRequestException(
                `Wait ${waitSeconds}s before requesting a new code`
            );
            }
        }

        // Generate new code
        const newCode = generateVerificationCode();
        user.verificationCode = newCode;
        user.resendCount += 1;
        user.lastResendAt = now;

        await this.userRepo.save(user);

        await this.mailService.sendVerificationEmail(user.email, newCode);

        return { message: "New verification code sent to your email" };
    }

}
