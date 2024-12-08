import { IsString, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CRUDSubjectDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	name: string

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	code: string
}
