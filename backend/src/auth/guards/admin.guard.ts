import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { PermissionService } from "src/permission/permission.service";

@Injectable()
export class AdminGuard implements CanActivate{
    constructor(private readonly permService: PermissionService){}

    async canActivate(context: ExecutionContext):Promise<boolean> {
        const req = context.switchToHttp().getRequest()
        const user = req.user

        if(!user) throw new ForbiddenException("Not Authenticated")

        const isAdmin = await this.permService.isAdmin(user.sub)

        if(!isAdmin) throw new ForbiddenException("You cant do this")

        return true
    }
}