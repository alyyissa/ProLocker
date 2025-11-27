import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt'){
    constructor(configService: ConfigService){
        const secret = configService.get<string>('JWT_ACCESS_SECRET') as string;
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: secret
        })
    }

    validate(payload: any){
        return payload;
    }
}