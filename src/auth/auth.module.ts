import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { PrismaModule } from '@/prisma/prisma.module'
import { UsersModule } from '@/users/users.module'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule } from '@nestjs/config'
import { AuthGuard } from './gurd/auth.guard'
import { APP_GUARD } from '@nestjs/core'
import { RolesGuard } from './gurd/roles.guard'

@Module({
	imports: [
		PrismaModule,
		UsersModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async () => ({
				secret: process.env.JWT_SECRET,
				global: true,
				signOptions: { expiresIn: '60s' },
			}),
		}),
	],
	controllers: [AuthController],
	providers: [
		AuthService,
		{
			provide: APP_GUARD,
			useClass: AuthGuard,
		},
		{
			provide: APP_GUARD,
			useClass: RolesGuard,
		},
	],
})
export class AuthModule {}
