import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNotEmpty } from 'class-validator'

export class FileDto {
	@ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
	@IsArray()
	@IsNotEmpty()
	files: Express.Multer.File[]
}
