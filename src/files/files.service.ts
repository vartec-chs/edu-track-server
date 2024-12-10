import { Answer } from '@/global'
import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { access, writeFile, mkdir, rm } from 'fs/promises'
import { basename, join } from 'path'

@Injectable()
export class FilesService {
	constructor(private configService: ConfigService) {}

	private readonly uploadDir = join(
		process.cwd(),
		this.configService.getOrThrow<string>('UPLOAD_DIR'),
	)

	async createUploadPath(subjectCode: string, taskCode: string): Promise<string> {
		const dirPath = join(this.uploadDir + '\\tasks', subjectCode, taskCode)
		try {
			await mkdir(dirPath, { recursive: true })
		} catch (error) {
			throw new BadRequestException(`Ошибка при создании папки: ${error.message}`)
		}

		return dirPath
	}

	async saveFile(file: Express.Multer.File, uploadPath: string) {
		if (!file) {
			throw new BadRequestException('Файл не предоставлен')
		}


		const fileName = file.originalname

		console.log(`Имя файла: ${fileName}`)

		const filePath = join(uploadPath, fileName)

		try {
			await writeFile(filePath, file.buffer)
		} catch (error) {
			throw new BadRequestException(`Ошибка при сохранении файла: ${error.message}`)
		}
		return {
			fileName: file.originalname,
			path: filePath,
			extension: file.mimetype.split('/')[1],
		}
	}


	async saveFiles(files: Express.Multer.File[], uploadPath: string) {
		const filePromises = files.map((file) => this.saveFile(file, uploadPath))
		const filePaths = await Promise.all(filePromises)
		return filePaths
	}

	async deleteFolder(folderPath: string): Promise<Answer<string>> {
		try {
			await rm(folderPath, { recursive: true, force: true })
		} catch (error) {
			throw new BadRequestException(`Ошибка при удалении папки: ${error.message}`)
		}
		return {
			status: 'success',
			message: 'Папка успешно удалена',
			data: folderPath,
		}
	}
}
