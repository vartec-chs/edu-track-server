import { Controller, Get, Param, Post, Delete, Put, Body } from '@nestjs/common'
import { SubjectsService } from './subjects.service'
import { CRUDSubjectDto } from './dto/crud-subject.dto'
import { Roles } from '@/auth/decorator/roles.decorator'
import { Role } from '@prisma/client'

@Roles(Role.TEACHER)
@Controller('subjects')
export class SubjectsController {
	constructor(private readonly subjectsService: SubjectsService) {}

	@Post()
	async create(@Body() createSubjectDto: CRUDSubjectDto) {
		return this.subjectsService.create(createSubjectDto)
	}

	@Delete(':id')
	async remove(@Param('id') id: string) {
		return this.subjectsService.remove(id)
	}

	@Put(':id')
	async update(@Param('id') id: string, @Body() updateSubjectDto: CRUDSubjectDto) {
		return this.subjectsService.update(id, updateSubjectDto)
	}

	@Get()
	async findAll() {
		return this.subjectsService.findAll()
	}

	@Get(':id')
	async findOne(@Param('id') id: string) {
		return this.subjectsService.findOne(id)
	}

	@Get('name/:name')
	async findByName(@Param('name') name: string) {
		return this.subjectsService.findByName(name)
	}

	@Put(':id/teacher/:teacherId')
	async setTeacher(@Param('id') id: string, @Param('teacherId') teacherId: string) {
		return this.subjectsService.setTeacher(id, teacherId)
	}

	@Delete(':id/teacher/:teacherId')
	async unsetTeacher(@Param('id') id: string, @Param('teacherId') teacherId: string) {
		return this.subjectsService.unsetTeacher(id, teacherId)
	}

	@Get('teacher/:teacherId')
	async getTeacherSubjects(@Param('teacherId') teacherId: string) {
		return this.subjectsService.getTeacherSubjects(teacherId)
	}
}
