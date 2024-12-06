import { PrismaService } from '@/prisma/prisma.service'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import * as argon2 from 'argon2'

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
}
