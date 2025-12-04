import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post('signup')
    @UseGuards(ThrottlerGuard)
    @Throttle( { default: {limit: 5, ttl: 3600}})
    signup(@Body() dto: CreateUserDto){
        return this.authService.signup(dto)
    }

    @Post('login')
    @UseGuards(ThrottlerGuard)
    @Throttle( { default: {limit: 5 ,ttl: 3600}})
    login(@Body() dto: LoginDto){
        return this.authService.login(dto)
    }

    @UseGuards(JwtAuthGuard)
    @Post('refresh')
    refresh(@Body() body: {userId: number, refreshToken: string}){
        return this.authService.refresh(body.userId, body.refreshToken)
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(@Req() req){
        return this.authService.logout(req.user.sub)
    }

    @Post('resend-code')
    async resendCode(@Body('email') email: string) {
        return this.authService.resendVerificationCode(email);
    }

    @Post('verify-email')
    async verifyEmail(@Body() body: { email: string; code: string }) {
    return this.authService.verifyEmail(body.email, body.code);
    }

}
