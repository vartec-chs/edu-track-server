import { IsString, IsNumber, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateGroupDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	specialization: string

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	shortName: string

	@ApiProperty()
	@IsNumber()
	@IsNotEmpty()
	number: number
}
