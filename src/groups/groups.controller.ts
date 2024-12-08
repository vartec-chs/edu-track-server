import { Controller, Post, Body, Delete, Put, Get, Query, Param } from '@nestjs/common'
import { GroupsService } from './groups.service'
import { CreateGroupDto } from './dto/create-group.dto'
import { CRUDGroupDto } from './dto/crud-users-in-groups.dto'
import { Roles } from '@/auth/decorator/roles.decorator'
import { Role } from '@prisma/client'

@Controller('groups')
export class GroupsController {
	constructor(private readonly groupsService: GroupsService) {}

	@Post()
	@Roles(Role.ADMIN)
	async create(@Body() createGroupDto: CreateGroupDto) {
		return this.groupsService.create(createGroupDto)
	}

	@Get()
	@Roles(Role.ADMIN)
	async findAll(@Query('page') page: number, @Query('limit') limit: number) {
		return this.groupsService.findAll(Number(page), Number(limit))
	}

	@Get(':id')
	@Roles(Role.ADMIN)
	async findOne(@Param('id') id: string) {
		return this.groupsService.findOne(id)
	}

	@Put(':id')
	@Roles(Role.ADMIN)
	async update(@Param('id') id: string, @Body() createGroupDto: CreateGroupDto) {
		return this.groupsService.update(id, createGroupDto)
	}

	@Delete(':id')
	@Roles(Role.ADMIN)
	async remove(@Param('id') id: string) {
		return this.groupsService.remove(id)
	}

	@Get(':id/users')
	@Roles(Role.ADMIN)
	async findAllUsersInGroup(@Param('id') id: string) {
		return this.groupsService.findAllUsersInGroup(id)
	}

	@Post('add-teacher')
	@Roles(Role.ADMIN)
	async addTeacherToGroup(@Body() { groupId, userId }: CRUDGroupDto) {
		return this.groupsService.addTeacherToGroup(groupId, userId)
	}

	@Post('add-student')
	@Roles(Role.ADMIN)
	async addStudentToGroup(@Body() { groupId, userId }: CRUDGroupDto) {
		return this.groupsService.addStudentToGroup(groupId, userId)
	}

	@Delete('remove-teacher')
	@Roles(Role.ADMIN)
	async removeTeacherFromGroup(@Body() { groupId, userId }: CRUDGroupDto) {
		return this.groupsService.removeTeacherFromGroup(groupId, userId)
	}

	@Delete('remove-student')
	@Roles(Role.ADMIN)
	async removeStudentFromGroup(@Body() { groupId, userId }: CRUDGroupDto) {
		return this.groupsService.removeStudentFromGroup(groupId, userId)
	}
}
