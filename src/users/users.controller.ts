import { Controller, Get, Param } from '@nestjs/common'
import { UsersService } from './users.service'
import { RolesGuard } from '@/auth/gurd/roles.guard'
import { Role } from '@prisma/client'
import { Roles } from '@/auth/decorator/roles.decorator'

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	@Roles(Role.ADMIN)
	findAll() {
		return this.usersService.findAll(1, 10)
	}

	@Roles(Role.ADMIN)
	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.usersService.findOne(id)
	}

	@Roles(Role.ADMIN)
	@Get('email/:email')
	findByEmail(@Param('email') email: string) {
		return this.usersService.findByEmail(email)
	}
}
