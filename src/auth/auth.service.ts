import { PrismaService } from '@/prisma/prisma.service'
import { UsersService } from '@/users/users.service'
import { Injectable } from '@nestjs/common'
import { CreateUserDto } from '@/users/dto/create-user.dto'
import { SignInDto } from './dto/sign-in.dto'
import * as argon2 from 'argon2'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService,
	) {}

	async signup(createUserDto: CreateUserDto) {
		return await this.usersService.create(createUserDto)
	}

	async signin(signinDto: SignInDto) {
		const user = await this.prisma.user.findUnique({
			where: {
				email: signinDto.email,
			},
			select: {
				id: true,
				email: true,
				password: true,
				role: true,
			},
		})

		if (await argon2.verify(signinDto.password, user.password)) {
			throw new Error('Некорректный email или пароль')
		}

		const payload = { id: user.id, role: user.role }
		const tokens = await this.generateToken(payload)

		return user
	}

	private async generateToken(payload: Record<string, any>) {
		const accessToken = await this.jwtService.signAsync(payload)

		const refreshToken = await this.jwtService.signAsync(payload, {
			expiresIn: '7d',
		})

		return {
			accessToken,
			refreshToken,
		}
	}
}
