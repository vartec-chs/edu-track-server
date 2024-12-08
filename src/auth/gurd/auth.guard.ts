import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
		private readonly reflector: Reflector,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
			context.getHandler(),
			context.getClass(),
		])
		if (isPublic) return true

		const request = context.switchToHttp().getRequest()
		const token = this.extractTokenFromHeader(request)
		if (!token) throw new UnauthorizedException()

		try {
			const payload = await this.jwtService.verifyAsync(token, {
				secret: this.configService.get('JWT_SECRET'),
			})

			request['user'] = payload
		} catch {
			throw new UnauthorizedException('Неверный токен')
		}
		return true
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		const accessToken = request.cookies['accessToken']
		return accessToken
	}
}
