import { IsArray, IsDate, IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CrudTaskDto {
	@IsNotEmpty()
	@IsString()
	@ApiProperty({ example: 'Задание 1', description: 'Название задания' })
	title: string

	@IsNotEmpty()
	@IsString()
	@ApiProperty({ example: 'Описание задания', description: 'Описание задания' })
	description: string

	@IsNotEmpty()
	@IsDateString()
	@ApiProperty({
		example: '2024-01-01',
		description: 'Дедлайн задания',
		format: 'date',
		type: Date,
	})
	deadline: Date

	@IsNotEmpty()
	@IsString()
	@ApiProperty({ example: '1', description: 'ID предмета' })
	subjectId: string

	@ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' }, description: 'Файлы' })
	files: Express.Multer.File[]
}
