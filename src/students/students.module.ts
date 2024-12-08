import { Module } from '@nestjs/common'
import { StudentsService } from './students.service'
import { StudentsController } from './students.controller'
import { UsersModule } from '@/users/users.module'
import { PrismaModule } from '@/prisma/prisma.module'

@Module({
	imports: [PrismaModule, UsersModule],
	controllers: [StudentsController],
	providers: [StudentsService],
})
export class StudentsModule {}
