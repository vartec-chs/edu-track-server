import { PrismaService } from '@/prisma/prisma.service'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateGroupDto } from './dto/create-group.dto'
import { Group } from '@prisma/client'

@Injectable()
export class GroupsService {
	constructor(private readonly prisma: PrismaService) {}

	async create(createGroupDto: CreateGroupDto) {
		const groupIsExist = await this.prisma.group.findFirst({
			where: {
				number: createGroupDto.number,
				shortName: createGroupDto.shortName,
				specialization: createGroupDto.specialization,
			},
			select: {
				id: true,
			},
		})

		if (groupIsExist) throw new HttpException('Группа уже существует', HttpStatus.CONFLICT)
		const group = await this.prisma.group.create({ data: createGroupDto })
		return {
			status: 'success',
			message: 'Группа успешно создана',
			data: group,
		}
	}

	async findAll(page: number, limit: number) {
		if (!page) page = 1
		if (!limit) limit = 10

		let groups: Group[] = []

		try {
			groups = await this.prisma.group.findMany({
				skip: (page - 1) * limit,
				take: limit,
			})
		} catch (error) {
			throw new HttpException('Группы не найдены', HttpStatus.NOT_FOUND)
		}

		return {
			status: 'success',
			message: 'Группы успешно получены',
			data: groups,
			total: await this.prisma.group.count(),
			page,
			totalPages: Math.ceil((await this.prisma.group.count()) / limit),
		}
	}

	async findOne(id: string) {
		const group = await this.prisma.group.findUnique({
			where: {
				id,
			},
			select: {
				id: true,
				shortName: true,
				number: true,
			},
		})
		if (!group) throw new HttpException('Группа не найдена', HttpStatus.NOT_FOUND)
		return {
			status: 'success',
			message: 'Группа успешно получена',
			data: group,
		}
	}

	async remove(id: string) {
		const group = await this.prisma.group.findUnique({
			where: {
				id,
			},
		})
		if (!group) throw new HttpException('Группа не найдена', HttpStatus.NOT_FOUND)
		await this.prisma.group.delete({
			where: {
				id,
			},
		})
		return {
			status: 'success',
			message: 'Группа успешно удалена',
		}
	}

	async update(id: string, createGroupDto: CreateGroupDto) {
		const group = await this.prisma.group.findUnique({
			where: {
				id,
			},
		})
		if (!group) throw new HttpException('Группа не найдена', HttpStatus.NOT_FOUND)
		await this.prisma.group.update({
			where: {
				id,
			},
			data: createGroupDto,
		})
		return {
			status: 'success',
			message: 'Группа успешно обновлена',
		}
	}

	// async addTeacherToGroup(groupId: string, id: string) {
	// 	try {
	// 		await this.prisma.teacher.update({
	// 			where: {
	// 				id,
	// 			},
	// 			data: {
	// 				groups: {
	// 					connect: {
	// 						id: groupId,
	// 					},
	// 				},
	// 			},
	// 		})
	// 	} catch (error) {
	// 		console.log(error)
	// 		throw new HttpException('Преподаватель уже добавлен в группу', HttpStatus.CONFLICT)
	// 	}

	// 	return {
	// 		status: 'success',
	// 		message: 'Преподаватель успешно добавлен в группу',
	// 	}
	// }

	async addTeacherToGroup(groupId: string, id: string) {
		// Проверяем, существует ли преподаватель
		const teacherExists = await this.prisma.teacher.findUnique({
			where: { id },
		})
		if (!teacherExists) {
			throw new HttpException('Преподаватель не найден', HttpStatus.NOT_FOUND)
		}

		// Проверяем, существует ли группа
		const groupExists = await this.prisma.group.findUnique({
			where: { id: groupId },
		})
		if (!groupExists) {
			throw new HttpException('Группа не найдена', HttpStatus.NOT_FOUND)
		}

		try {
			// Добавляем связь между преподавателем и группой
			await this.prisma.teacher.update({
				where: { id },
				data: {
					groups: {
						connect: { id: groupId },
					},
				},
			})

			return {
				status: 'success',
				message: 'Преподаватель успешно добавлен в группу',
			}
		} catch (error) {
			console.log(error)
			throw new HttpException('Преподаватель уже добавлен в группу', HttpStatus.CONFLICT)
		}
	}

	async removeTeacherFromGroup(groupId: string, id: string) {
		try {
			await this.prisma.group.update({
				where: {
					id: groupId,
				},
				data: {
					teachers: {
						disconnect: {
							id,
						},
					},
				},
			})
		} catch (error) {
			throw new HttpException('Преподаватель уже удален из группы', HttpStatus.CONFLICT)
		}

		return {
			status: 'success',
			message: 'Преподаватель успешно удален из группы',
		}
	}

	async addStudentToGroup(groupId: string, id: string) {
		try {
			await this.prisma.group.update({
				where: {
					id: groupId,
				},
				data: {
					students: {
						connect: {
							id,
						},
					},
				},
			})
		} catch (error) {
			throw new HttpException('Студент уже добавлен в группу', HttpStatus.CONFLICT)
		}

		return {
			status: 'success',
			message: 'Студент успешно добавлен в группу',
		}
	}

	async removeStudentFromGroup(groupId: string, id: string) {
		try {
			await this.prisma.group.update({
				where: {
					id: groupId,
				},
				data: {
					students: {
						disconnect: {
							id,
						},
					},
				},
			})
		} catch (error) {
			throw new HttpException('Студент уже удален из группы', HttpStatus.CONFLICT)
		}

		return {
			status: 'success',
			message: 'Студент успешно удален из группы',
		}
	}

	async findAllUsersInGroup(groupId: string) {
		try {
			const users = await this.prisma.group.findUniqueOrThrow({
				where: {
					id: groupId,
				},
				select: {
					students: {
						select: {
							id: true,
							user: {
								select: {
									firstName: true,
									lastName: true,
									surname: true,
								},
							},
						},
					},
					teachers: {
						select: {
							id: true,
							user: {
								select: {
									firstName: true,
									lastName: true,
									surname: true,
								},
							},
						},
					},
				},
			})
			return {
				status: 'success',
				message: 'Пользователи успешно получены',
				data: users,
			}
		} catch (error) {
			throw new HttpException('Пользователи не найдены', HttpStatus.NOT_FOUND)
		}
	}
}
