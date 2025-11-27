import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [TypeOrmModule.forFeature([User]),
            JwtModule.register({
              secret: 'mySuperSecretKey123!',
              signOptions: {expiresIn: '60m'}
            })
]
})
export class AuthModule {}
