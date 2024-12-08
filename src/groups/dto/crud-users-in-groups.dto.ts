import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CRUDGroupDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	groupId: string

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	userId: string
}
