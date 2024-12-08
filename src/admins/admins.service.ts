import { PrismaService } from '@/prisma/prisma.service'
import { UsersService } from '@/users/users.service'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { Role } from '@prisma/client'

@Injectable()
export class AdminsService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly usersService: UsersService,
	) {}

	async setRole(id: string, roles: Role[]) {
		return await this.usersService.setRole(id, roles)
	}
}
