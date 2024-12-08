import { PrismaService } from '@/prisma/prisma.service'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CRUDSubjectDto } from './dto/crud-subject.dto'

@Injectable()
export class SubjectsService {
	constructor(private readonly prisma: PrismaService) {}

	async create(createSubjectDto: CRUDSubjectDto) {
		try {
			const answer = await this.prisma.subject.create({
				data: createSubjectDto,
			})
			return {
				status: 'success',
				message: 'Предмет успешно создан',
				data: answer,
			}
		} catch (error) {
			throw new HttpException(`Премет не создан по причине: ${error}`, HttpStatus.BAD_REQUEST)
		}
	}

	async findAll() {
		try {
			const answer = await this.prisma.subject.findMany()
			return {
				status: 'success',
				message: 'Предметы успешно получены',
				data: answer,
			}
		} catch (error) {
			throw new HttpException('Предметы не найдены', HttpStatus.NOT_FOUND)
		}
	}

	async findOne(id: string) {
		try {
			const answer = await this.prisma.subject.findUnique({
				where: {
					id,
				},
			})
			return {
				status: 'success',
				message: 'Предмет успешно получен',
				data: answer,
			}
		} catch (error) {
			throw new HttpException('Предмет не найден', HttpStatus.NOT_FOUND)
		}
	}

	async remove(id: string) {
		try {
			const answer = await this.prisma.subject.delete({
				where: {
					id,
				},
			})
			return {
				status: 'success',
				message: 'Предмет успешно удален',
				data: answer,
			}
		} catch (error) {
			throw new HttpException('Предмет не найден', HttpStatus.NOT_FOUND)
		}
	}

	async update(id: string, createSubjectDto: CRUDSubjectDto) {
		try {
			const answer = await this.prisma.subject.update({
				where: {
					id,
				},
				data: createSubjectDto,
			})
			return {
				status: 'success',
				message: 'Предмет успешно обновлен',
				data: answer,
			}
		} catch (error) {
			throw new HttpException('Предмет не найден', HttpStatus.NOT_FOUND)
		}
	}

	async findByName(name: string) {
		try {
			const answer = await this.prisma.subject.findUnique({
				where: {
					name,
				},
				select: {
					id: true,
					name: true,
					code: true,
				},
			})

			return {
				status: 'success',
				message: 'Предмет успешно получен',
				data: answer,
			}
		} catch (error) {
			throw new HttpException('Предмет не найден', HttpStatus.NOT_FOUND)
		}
	}

	async setTeacher(id: string, teacherId: string) {
		try {
			const answer = await this.prisma.subject.update({
				where: {
					id,
				},
				data: {
					teachers: {
						connect: {
							id: teacherId,
						},
					},
				},
				select: {
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
				message: 'Преподаватель успешно назначен',
				data: answer,
			}
		} catch (error) {
			throw new HttpException('Преподаватель уже назначен', HttpStatus.CONFLICT)
		}
	}

	async unsetTeacher(id: string, teacherId: string) {
		try {
			const answer = await this.prisma.subject.update({
				where: {
					id,
				},
				data: {
					teachers: {
						disconnect: {
							id: teacherId,
						},
					},
				},
				select: {
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
				message: 'Преподаватель успешно удален',
				data: answer,
			}
		} catch (error) {
			throw new HttpException('Преподаватель не назначен', HttpStatus.CONFLICT)
		}
	}

	async getTeacherSubjects(teacherId: string) {
		try {
			const answer = await this.prisma.subject.findMany({
				where: {
					teachers: {
						some: {
							id: teacherId,
						},
					},
				},
			})
			return {
				status: 'success',
				message: 'Предметы успешно получены',
				data: answer,
			}
		} catch (error) {
			throw new HttpException('Предметы не найдены', HttpStatus.NOT_FOUND)
		}
	}
}
