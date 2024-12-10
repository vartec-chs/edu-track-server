import { FilesService } from './files.service'
import { Controller, Post, UseInterceptors, UploadedFiles, Body } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiConsumes, ApiOperation } from '@nestjs/swagger'
import { FileDto } from './dto/file.dto'
import { Public } from '@/auth/decorator/public.decorator'

@Controller('files')
export class FilesController {
	constructor(private readonly filesService: FilesService) {}

	// @Public()
	// @Post('upload-multiple')
	// @ApiConsumes('multipart/form-data')
	// @ApiOperation({ summary: 'Attendance Punch In' })
	// @UseInterceptors(FileInterceptor('files'))
	// async uploadMultiple(@Body() data: FileDto, @UploadedFiles() files: Express.Multer.File[]) {
	// 	return this.filesService.uploadMultiple(files)
	// }
}
