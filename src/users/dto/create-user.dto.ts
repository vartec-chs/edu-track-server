import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength, IsOptional } from 'class-validator'

export class CreateUserDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	@MinLength(2)
	@MaxLength(43)
	firstName: string

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	@MinLength(2)
	@MaxLength(43)
	lastName: string

	@ApiPropertyOptional()
	@IsString()
	@MaxLength(43)
	@IsOptional()
	surname: string

	@ApiProperty()
	@IsEmail()
	@IsNotEmpty()
	email: string

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	password: string
}
