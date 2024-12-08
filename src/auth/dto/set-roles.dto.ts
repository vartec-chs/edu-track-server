import { Role } from '@prisma/client'
import { IsEnum, IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

enum RoleEnum {
	ADMIN = 'ADMIN',
	TEACHER = 'TEACHER',
	STUDENT = 'STUDENT',
}

export class SetRolesDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	id: string

	@ApiProperty()
	@IsEnum(RoleEnum, { each: true })
	@IsNotEmpty()
	roles: Role[]
}
