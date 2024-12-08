import { PrismaService } from '@/prisma/prisma.service'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import * as argon2 from 'argon2'
import { Role } from '@prisma/client'

const confirmedEmailHosts = [
	'gmail.com',
	'yahoo.com',
	'hotmail.com',
	'outlook.com',
	'icloud.com',
	'mail.ru',
	'yandex.ru',
]

@Injectable()
export class UsersService {
	constructor(private readonly prisma: PrismaService) {}

	async create(createUserDto: CreateUserDto) {
		if (!confirmedEmailHosts.includes(createUserDto.email.split('@')[1])) {
			throw new HttpException('Некорректный email', HttpStatus.BAD_REQUEST)
		}

		const userIsExist = await this.prisma.user.findUnique({
			where: {
				email: createUserDto.email,
				OR: [
					{
						firstName: createUserDto.firstName,
						lastName: createUserDto.lastName,
					},
				],
			},
			select: {
				id: true,
			},
		})

		if (userIsExist) {
			throw new HttpException('Такой пользователь уже существует', HttpStatus.CONFLICT)
		}

		const user = await this.prisma.user.create({
			data: {
				...createUserDto,
				password: await argon2.hash(createUserDto.password),
			},
			select: {
				id: true,
			},
		})

		return {
			status: 'success',
			message: 'Пользователь успешно создан',
			data: user,
		}
	}

	async findAll(page: number, limit: number) {
		const users = await this.prisma.user.findMany({
			select: {
				id: true,
				firstName: true,
				lastName: true,
				surname: true,
				email: true,
				createdAt: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
			skip: (page - 1) * limit,
			take: limit,
		})

		if (!users.length) {
			throw new HttpException('Пользователи не найдены', HttpStatus.NOT_FOUND)
		}

		return {
			status: 'success',
			message: 'Пользователи успешно получены',
			data: users,
			total: await this.prisma.user.count(),
			page,
			totalPages: Math.ceil((await this.prisma.user.count()) / limit),
		}
	}

	async findOne(id: string) {
		const user = await this.prisma.user.findUnique({
			where: {
				id,
			},
			select: {
				id: true,
				firstName: true,
				lastName: true,
				surname: true,
				email: true,
				createdAt: true,
			},
		})

		if (!user) {
			throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND)
		}

		return {
			status: 'success',
			message: 'Пользователь успешно получен',
			data: user,
		}
	}

	async findByEmail(email: string) {
		const user = await this.prisma.user.findUnique({
			where: {
				email,
			},
			select: {
				id: true,
				firstName: true,
				lastName: true,
				surname: true,
				email: true,
				createdAt: true,
			},
		})

		if (!user) {
			throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND)
		}

		return {
			status: 'success',
			message: 'Пользователь успешно получен',
			data: user,
		}
	}

	async isUserExist(id: string) {
		const user = await this.prisma.user.findUnique({
			where: {
				id,
			},
			select: {
				id: true,
			},
		})

		return !!user
	}

	async setRole(id: string, roles: Role[]) {
		const user = await this.prisma.user.findUnique({
			where: {
				id,
			},
			select: {
				id: true,
				firstName: true,
				lastName: true,
				surname: true,
				email: true,
				createdAt: true,
				roles: true,
			},
		})

		if (!user) {
			throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND)
		}

		if (user.roles === roles) {
			throw new HttpException('Роли не изменились', HttpStatus.BAD_REQUEST)
		}

		await this.prisma.user.update({
			where: {
				id,
			},
			data: {
				roles,
			},
		})

		if (roles.includes(Role.TEACHER) && !user.roles.includes(Role.TEACHER)) {
			await this.createTeacherProfile(id)
		}

		if (roles.includes(Role.STUDENT) && !user.roles.includes(Role.STUDENT)) {
			await this.createStudentProfile(id)
		}

		if (user.roles.includes(Role.TEACHER) && !roles.includes(Role.TEACHER)) {
			await this.removeTeacherProfile(id)
		}

		if (user.roles.includes(Role.STUDENT) && !roles.includes(Role.STUDENT)) {
			await this.removeStudentProfile(id)
		}

		return {
			status: 'success',
			message: 'Роли успешно изменены',
			data: user,
		}
	}

	async createTeacherProfile(userId: string) {
		return await this.prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				teacher: {
					create: {},
				},
			},
		})
	}

	async createStudentProfile(userId: string) {
		return await this.prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				student: {
					create: {},
				},
			},
		})
	}

	async removeStudentProfile(userId: string) {
		return await this.prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				student: {
					delete: true,
				},
			},
		})
	}

	async removeTeacherProfile(userId: string) {
		return await this.prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				teacher: {
					delete: true,
				},
			},
		})
	}
}
