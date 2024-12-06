import { NestFactory } from '@nestjs/core'
import { AppModule } from '@/app.module'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import cookieParser from 'cookie-parser'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	app.setGlobalPrefix('api')

	const config = new DocumentBuilder()
		.setTitle('Edu Track API')
		.setVersion('1.0')
		.addBearerAuth()
		.build()
	const document = SwaggerModule.createDocument(app, config)
	SwaggerModule.setup('docs', app, document, {
		useGlobalPrefix: true,
	})

	app.useGlobalPipes(new ValidationPipe())
	app.use(cookieParser())

	await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
