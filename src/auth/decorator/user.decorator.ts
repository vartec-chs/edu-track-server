import { JWTUser } from '@/global'
import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const User = createParamDecorator((data: unknown, ctx: ExecutionContext): JWTUser => {
	const request = ctx.switchToHttp().getRequest()
	return request.user as JWTUser
})
