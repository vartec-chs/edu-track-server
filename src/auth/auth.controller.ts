import { Controller, Body, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { CreateUserDto } from '@/users/dto/create-user.dto'
import { SignInDto } from './dto/sign-in.dto'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('signup')
	async signup(@Body() createUserDto: CreateUserDto) {
		return await this.authService.signup(createUserDto)
	}

	@Post('signin')
	async signin(@Body() signinDto: SignInDto) {
		return await this.authService.signin(signinDto)
	}
}
