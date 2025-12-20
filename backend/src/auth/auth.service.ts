import { 
  BadRequestException, 
  ConflictException, 
  ForbiddenException, 
  Injectable, 
  NotFoundException, 
  UnauthorizedException 
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository, MoreThan } from 'typeorm';
import { SignupDto } from './dto/signup.dto';
import * as bcrypt from 'bcryptjs'
import { LoginDto } from './dto/login.dto';
import { generateVerificationCode } from './utils';
import { MailService } from 'src/mail/mail.service';
import * as jwt from 'jsonwebtoken'; // ADD THIS IMPORT
import * as crypto from 'crypto';

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

        return {
          user: {
            id: user.id, 
            email: user.email, 
            firstName: user.firstName, 
            lastName: user.lastName
          }, 
          ...tokens
        }
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

    async refresh(refreshToken: string) {
    try {
        const refreshSecret = process.env.JWT_REFRESH_SECRET;
        if (!refreshSecret) {
            throw new Error('JWT_REFRESH_SECRET is not configured');
        }

        const decoded = jwt.verify(refreshToken, refreshSecret) as any;
        if (!decoded || !decoded.sub) {
            throw new ForbiddenException("Invalid refresh token");
        }
        
        const userId = parseInt(decoded.sub);
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user || !user.refreshToken) {
            throw new ForbiddenException("Access Denied");
        }
        const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
        if (!isValid) {
            throw new ForbiddenException("Access Denied");
        }
        const tokens = await this.getToken(user.id, user.email);

        await this.updateRefreshToken(user.id, tokens.refreshToken);

        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            }
        };
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new ForbiddenException('Refresh token expired');
        }
        if (error instanceof jwt.JsonWebTokenError) {
            throw new ForbiddenException('Invalid refresh token');
        }
        throw error;
    }
}

    async verifyEmail(email: string, code: string) {
        const user = await this.userRepo.findOne({ where: { email } });
        if (!user) {
            console.log("User not found for email:", email);
            throw new BadRequestException("Invalid verification code");
        }
        console.log("User found:", {
            email: user.email,
            verificationCode: user.verificationCode,
            codeGeneratedAt: user.codeGeneratedAt,
            isVerified: user.isVerified,
        });

        if (user.isVerified) {
            console.log("User already verified:", email);
            throw new BadRequestException("User already verified");
        }

        const dbCode = user.verificationCode?.toString().trim();
        const inputCode = code?.toString().trim();

        if (dbCode !== inputCode) {
            console.log("Verification codes do not match");
            throw new BadRequestException("Invalid verification code");
        }

        if (!user.codeGeneratedAt) {
            console.log("No codeGeneratedAt found for user:", email);
            throw new BadRequestException("No verification code found");
        }

        const now = new Date();
        const expiryTime = new Date(new Date(user.codeGeneratedAt).getTime() + 10 * 60000);
        console.log("Current time:", now);
        console.log("Code expiry time:", expiryTime);

        if (now > expiryTime) {
            console.log("Verification code expired for user:", email);
            throw new BadRequestException("Code expired, try again");
        }

        user.isVerified = true;
        user.verificationCode = null;
        user.codeGeneratedAt = null;
        await this.userRepo.save(user);
        console.log("User verified successfully:", email);

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
            ...tokens,
        };
    }

    async resendVerificationCode(email: string) {
        const user = await this.userRepo.findOne({ where: { email } });
        if (!user) throw new NotFoundException("User not found");
        if (user.isVerified) throw new BadRequestException("User already verified");

        const now = new Date();

        if (user.resendCount >= 2) {
            throw new ForbiddenException("Resend limit reached. Contact support.");
        }

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

        const newCode = generateVerificationCode();
        user.verificationCode = newCode;
        user.resendCount += 1;
        user.lastResendAt = now;

        await this.userRepo.save(user);

        await this.mailService.sendVerificationEmail(user.email, newCode);

        return { message: "New verification code sent to your email" };
    }

    async forgotPassword(email: string) {
        // Find user by email
        const user = await this.userRepo.findOne({ where: { email } });
        
        // For security reasons, don't reveal if user exists or not
        if (!user) {
            return { 
                message: "If an account exists with this email, you will receive a password reset link shortly."
            };
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        
        // Create hash of reset token and save to database
        const hashedToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Set token and expiration (1 hour from now)
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
        
        await this.userRepo.save(user);

        // Send email with the unhashed token
        try {
            await this.mailService.sendPasswordResetEmail(user.email, resetToken);
        } catch (error) {
            // Clear the reset token if email fails to send
            user.resetPasswordToken = null;
            user.resetPasswordExpires = null;
            await this.userRepo.save(user);
            throw new BadRequestException('Failed to send reset email');
        }

        return { 
            message: "If an account exists with this email, you will receive a password reset link shortly."
        };
    }

    async resetPassword(token: string, newPassword: string) {
    const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');
    // Find user by token only
    const user = await this.userRepo.findOne({
        where: { resetPasswordToken: hashedToken }
    });

    if (!user) {
        throw new BadRequestException('Invalid or expired reset token');
    }

    // Check if token has expired (in JS)
    if (!user.resetPasswordExpires || new Date(user.resetPasswordExpires) < new Date()) {
        throw new BadRequestException('Reset token has expired');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset token
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await this.userRepo.save(user);

    // Generate new tokens for auto-login
    const tokens = await this.getToken(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
        message: "Password reset successfully",
        user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
        },
        ...tokens
    };
}

}