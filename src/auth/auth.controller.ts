import { Controller, Body, Post, Get, Request } from '@nestjs/common'
import { AuthService } from './auth.service'
import { CreateUserDto } from '@/users/dto/create-user.dto'
import { SignInDto } from './dto/sign-in.dto'
import { Request as ExpressRequest } from 'express'
import { Public } from './decorator/public.decorator'
import { Roles } from './decorator/roles.decorator'
import { Role } from '@prisma/client'
import { SetRolesDto } from './dto/set-roles.dto'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Public()
	@Post('signup')
	async signup(@Body() createUserDto: CreateUserDto) {
		return this.authService.signup(createUserDto)
	}

	@Public()
	@Post('signin')
	async signin(@Body() signinDto: SignInDto, @Request() req: ExpressRequest) {
		return this.authService.signin(signinDto, req)
	}

	@Post('signout')
	async signout(@Request() req: ExpressRequest) {
		return this.authService.signout(req.res)
	}

	@Public()
	@Post('refresh')
	async refresh(@Request() req: ExpressRequest) {
		return this.authService.refresh(req, req.res)
	}

	@Get('profile')
	async getProfile(@Request() req) {
		return {
			status: 'success',
			message: 'Профиль успешно получен',
			data: req.user,
		}
	}

	@Roles(Role.ADMIN)
	@Get('admin')
	async getAdmin() {
		return {
			status: 'success',
			message: 'Профиль успешно получен для администратора',
		}
	}

	@Roles(Role.TEACHER)
	@Get('teacher')
	async getTeacher() {
		return {
			status: 'success',
			message: 'Профиль успешно получен для преподавателя',
		}
	}

	@Roles(Role.ADMIN)
	@Post('set-role')
	async setRole(@Body() { id, roles }: SetRolesDto) {
		return this.authService.setRole(id, roles)
	}
}
