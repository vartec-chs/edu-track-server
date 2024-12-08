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
import { SubjectsModule } from './subjects/subjects.module';
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
		TasksModule,
		TeachersModule,
		GroupsModule,
		StudentsModule,
		AdminsModule,
		SubjectsModule,
	],
})
export class AppModule {}
