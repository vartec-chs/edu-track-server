import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsEmail, MinLength } from 'class-validator'

export class SignInDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	@IsEmail()
	email: string
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	@MinLength(8)
	password: string
}
