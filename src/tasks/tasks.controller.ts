import {
	Controller,
	Post,
	Delete,
	Body,
	UploadedFiles,
	UseInterceptors,
	Param,
	HttpCode,
	HttpStatus,
	Get,
	Query,
} from '@nestjs/common'
import { TasksService } from './tasks.service'
import { CrudTaskDto } from './dto/crud-task.dto'
import { JWTUser } from '@/global'
import { FilesInterceptor } from '@nestjs/platform-express'
import { User } from '@/auth/decorator/user.decorator'
import { ApiConsumes, ApiOperation } from '@nestjs/swagger'
import { diskStorage } from 'multer'
import { storage } from '@/files/storege'

@Controller('tasks')
export class TasksController {
	constructor(private readonly tasksService: TasksService) {}

	@Post()
	@ApiConsumes('multipart/form-data')
	@UseInterceptors(
		FilesInterceptor('files', 10, { limits: { fileSize: 100 * 1024 * 1024, files: 10 } }),
	)
	async create(
		@Body() dto: CrudTaskDto,
		@User() user: JWTUser,
		@UploadedFiles() files: Express.Multer.File[],
	) {
		return await this.tasksService.create(dto, user, files)
	}

	@Get(':id')
	async findById(@Param('id') id: number) {
		return await this.tasksService.findById(id)
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	async findAll(@Query('page') page: number, @Query('limit') limit: number) {
		return await this.tasksService.findAll(page, limit)
	}
}
