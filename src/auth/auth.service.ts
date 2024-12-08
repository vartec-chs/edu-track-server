import { PrismaService } from '@/prisma/prisma.service'
import { UsersService } from '@/users/users.service'
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common'
import { CreateUserDto } from '@/users/dto/create-user.dto'
import { SignInDto } from './dto/sign-in.dto'
import * as argon2 from 'argon2'
import { JwtService } from '@nestjs/jwt'
import { Request, Response } from 'express'
import { ConfigService } from '@nestjs/config'
import { Role } from '@prisma/client'

@Injectable()
export class AuthService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
	) {}

	async signup(createUserDto: CreateUserDto) {
		return await this.usersService.create(createUserDto)
	}

	async signin(signinDto: SignInDto, req: Request) {
		const userAgent = req.headers['user-agent']
		if (!userAgent) throw new UnauthorizedException('Неверный user-agent')

		const user = await this.prisma.user.findUnique({
			where: {
				email: signinDto.email,
			},
			select: {
				id: true,
				email: true,
				password: true,
				roles: true,
			},
		})
		if (!user) throw new UnauthorizedException('Такого пользователя не существует')

		const isPasswordValid = await argon2.verify(user.password, signinDto.password)
		if (!isPasswordValid) throw new UnauthorizedException('Неверный логин или пароль')

		const payload = { id: user.id, role: user.roles }
		const tokens = await this.generateToken(payload)

		const res = req.res

		res.cookie('refreshToken', tokens.refreshToken, {
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
		})

		res.cookie('accessToken', tokens.accessToken, {
			httpOnly: true,
			maxAge: 1000 * 60 * 15, // 15 minutes
		})

		return {
			status: 'success',
			message: 'Аутентификация прошла успешно',
		}
	}

	async signout(res: Response) {
		res.clearCookie('refreshToken')
		res.clearCookie('accessToken')

		return {
			status: 'success',
			message: 'Вы успешно вышли из системы',
		}
	}

	async refresh(req: Request, res: Response) {
		const userAgent = req.headers['user-agent']
		if (!userAgent) throw new UnauthorizedException('Неверный user-agent')

		const refreshToken = req.cookies['refreshToken']
		if (!refreshToken) throw new UnauthorizedException('Вы не авторизованы')

		const payload = await this.jwtService.verifyAsync(refreshToken, {
			secret: this.configService.get('JWT_SECRET_REFRESH'),
		})

		const user = await this.prisma.user.findUnique({
			where: {
				id: payload.id,
			},
			select: {
				id: true,
				roles: true,
			},
		})
		if (!user) throw new UnauthorizedException('Такого пользователя не существует')

		const newPayload = { id: user.id, role: user.roles }
		const tokens = await this.generateToken(newPayload)

		res.cookie('refreshToken', tokens.refreshToken, {
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
		})

		res.cookie('accessToken', tokens.accessToken, {
			httpOnly: true,
			maxAge: 1000 * 60 * 15, // 15 minutes
		})

		return {
			status: 'success',
			message: 'Токены успешно обновлены',
		}
	}

	private async generateToken(payload: Record<string, any>) {
		const accessToken = await this.jwtService.signAsync(payload, {
			expiresIn: '15m',
			secret: this.configService.get('JWT_SECRET'),
		})

		const refreshToken = await this.jwtService.signAsync(payload, {
			expiresIn: '7d',
			secret: this.configService.get('JWT_SECRET_REFRESH'),
		})

		return {
			accessToken,
			refreshToken,
		}
	}

	async setRole(id: string, roles: Role[]) {
		return await this.usersService.setRole(id, roles)
	}
}
