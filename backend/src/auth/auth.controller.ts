import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { AdminGuard } from './guards/admin.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post('signup')
    signup(@Body() dto: CreateUserDto){
        return this.authService.signup(dto)
    }

    @Post('login')
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

}
