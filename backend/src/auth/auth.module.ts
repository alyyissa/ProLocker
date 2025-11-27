import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  providers: [
              AuthService,
              JwtStrategy
            ],
  controllers: [AuthController],
  imports: [TypeOrmModule.forFeature([User]),
            JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
              secret: config.get<string>('JWT_ACCESS_SECRET'),
              signOptions: {expiresIn: config.get<string>('JWT_ACCESS_EXPIRES') as any}
            })
            })
]
})
export class AuthModule {}
