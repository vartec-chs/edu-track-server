import { Module } from '@nestjs/common'
import { AdminsService } from './admins.service'
import { AdminsController } from './admins.controller'
import { UsersModule } from '@/users/users.module'
import { PrismaModule } from '@/prisma/prisma.module'

@Module({
	imports: [PrismaModule, UsersModule],
	controllers: [AdminsController],
	providers: [AdminsService],
})
export class AdminsModule {}
