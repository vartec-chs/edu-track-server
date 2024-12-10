import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { PrismaModule } from './prisma/prisma.module'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { TasksModule } from './tasks/tasks.module'
import { TeachersModule } from './teachers/teachers.module'
import { GroupsModule } from './groups/groups.module'
import { StudentsModule } from './students/students.module'
import { AdminsModule } from './admins/admins.module'
import { SubjectsModule } from './subjects/subjects.module'
import { FilesModule } from './files/files.module'
import configuration from '@/config/configuration'
import { MulterModule } from '@nestjs/platform-express'
import { diskStorage } from 'multer'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			cache: true,
			load: [configuration],
		}),
		MulterModule.registerAsync({
			useFactory: () => ({
				storage: diskStorage({
					destination: './uploads',
				}),
			}),
		}),
		PrismaModule,
		UsersModule,
		AuthModule,
		TasksModule,
		TeachersModule,
		GroupsModule,
		StudentsModule,
		AdminsModule,
		SubjectsModule,
		FilesModule,
	],
})
export class AppModule {}
