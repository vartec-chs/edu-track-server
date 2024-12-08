import { Module } from '@nestjs/common'
import { TeachersService } from './teachers.service'
import { TeachersController } from './teachers.controller'
import { UsersModule } from '@/users/users.module'
import { PrismaModule } from '@/prisma/prisma.module'

@Module({
	imports: [PrismaModule, UsersModule],
	controllers: [TeachersController],
	providers: [TeachersService],
})
export class TeachersModule {}
