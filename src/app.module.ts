import { Module } from '@nestjs/common'

import { AppService } from '@/app.service'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import configuration from '@/config/configuration'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			cache: true,
			load: [configuration],
		}),
		PrismaModule,
		UsersModule,
		AuthModule,
	],
	controllers: [],
	providers: [AppService],
})
export class AppModule {}
