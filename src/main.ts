import { NestFactory } from '@nestjs/core'
import { AppModule } from '@/app.module'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import cookieParser from 'cookie-parser'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	const configService = app.get(ConfigService)

	app.setGlobalPrefix(configService.getOrThrow<string>('API_PREFIX'))

	const config = new DocumentBuilder()
		.setTitle(`${configService.getOrThrow<string>('APP_NAME')} API`)
		.setVersion(configService.getOrThrow<string>('APP_VERSION'))
		.build()
	const document = SwaggerModule.createDocument(app, config)
	SwaggerModule.setup('docs', app, document, {
		useGlobalPrefix: true,
	})

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true,
		}),
	)
	app.use(cookieParser(configService.getOrThrow<string>('COOKIE_SECRET')))

	app.enableCors({
		origin: configService.getOrThrow<string>('ORIGIN'),
		credentials: true,
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		allowedHeaders: '*',
	})

	await app.listen(
		configService.getOrThrow<number>('PORT'),
		configService.getOrThrow<string>('HOST'),
	)
}
bootstrap()
