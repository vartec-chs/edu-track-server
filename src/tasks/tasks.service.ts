import { PrismaService } from '@/prisma/prisma.service'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CrudTaskDto } from './dto/crud-task.dto'
import { Answer, JWTUser } from '@/global'
import { FilesService } from '@/files/files.service'
import { Task } from '@prisma/client'

@Injectable()
export class TasksService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly filesService: FilesService,
	) {}

	async create(
		dto: CrudTaskDto,
		user: JWTUser,
		files: Express.Multer.File[],
	): Promise<Answer<Task>> {
		const subject = await this.prisma.subject.findUnique({
			where: { id: dto.subjectId },
		})

		if (!subject) {
			throw new BadRequestException('Предмет не найден')
		}

		const teacher = await this.prisma.teacher.findFirst({
			where: { userId: user.id, subjects: { some: { id: subject.id } } },
			select: {
				id: true,
			},
		})

		if (!teacher) {
			throw new BadRequestException('Преподаватель не найден для данного предмета')
		}

		const deadline = new Date(dto.deadline).toISOString()

		const task = await this.prisma.task.create({
			data: {
				...dto,
				authorId: teacher.id,
				deadline: deadline,
			},
		})

		const uploadPath = await this.filesService.createUploadPath(subject.code, task.id.toString())

		const filePromises = files.map((file) => this.filesService.saveFile(file, uploadPath))
		const filePaths = await Promise.all(filePromises)

		await this.prisma.taskFile.createMany({
			data: filePaths.map((file) => ({
				fileName: file.fileName,
				path: file.path,
				taskId: task.id,
			})),
		})

		return {
			status: 'success',
			message: 'Задание успешно создано',
			data: task,
		}
	}

	async findById(id: number) {
		if (Number.isNaN(id)) {
			throw new BadRequestException('Неверный id')
		}

		const task = await this.prisma.task.findUnique({
			where: { id },
			select: {
				subject: {
					select: {
						id: true,
						name: true,
						code: true,
					},
				},
				title: true,
				description: true,
				deadline: true,
				methodFiles: {
					select: {
						fileName: true,
						path: true,
					},
				},
			},
		})

		if (!task) {
			throw new NotFoundException('Задание не найдено')
		}

		return {
			status: 'success',
			message: 'Задание успешно получено',
			data: task,
		}
	}

	async findAll(page: number, limit: number) {
		const tasks = await this.prisma.task.findMany({
			skip: (page - 1) * limit,
			take: limit,
			select: {
				id: true,
				title: true,
				description: true,
				deadline: true,
				subject: {
					select: {
						id: true,
						name: true,
						code: true,
					},
				},
				author: {
					select: {
						user: {
							select: {
								firstName: true,
								lastName: true,
								surname: true,
							},
						},
					},
				},
				methodFiles: {
					select: {
						fileName: true,
						path: true,
					},
				},
			},
		})

		return {
			status: 'success',
			message: 'Задания успешно получены',
			data: tasks,
			total: await this.prisma.task.count(),
			page,
			totalPages: Math.ceil((await this.prisma.task.count()) / limit),
		}
	}
}
