import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Role } from '@prisma/client'
import { ROLES_KEY } from '../decorator/roles.decorator'

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
			context.getHandler(),
			context.getClass(),
		])
		if (!requiredRoles) {
			return true
		}
		const { user } = context.switchToHttp().getRequest()

		console.log(user)

		const roles = user.role

		console.log(roles)

		if (roles.some((role) => requiredRoles.includes(role)) || roles.includes(Role.ADMIN)) {
			return true
		}
	}
}
