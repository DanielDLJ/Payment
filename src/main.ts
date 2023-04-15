import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger, LoggerErrorInterceptor } from "nestjs-pino";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as dotenv from "dotenv";
import { INestApplication } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

dotenv.config();

function configSwagger(app: INestApplication) {
  const configService = app.get(ConfigService);

  const documentBuilder = new DocumentBuilder()
    .setTitle(configService.get<string>("swagger.title"))
    .setDescription(configService.get<string>("swagger.description"))
    .setContact(
      configService.get<string>("swagger.contact.name"),
      "",
      configService.get<string>("swagger.contact.email"),
    )
    .setVersion(configService.get<string>("swagger.version"))
    .build();

  const document = SwaggerModule.createDocument(app, documentBuilder);
  SwaggerModule.setup("swagger", app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const configService = app.get(ConfigService);

  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  app.flushLogs();

  if (configService.get<boolean>("swagger.enable")) {
    configSwagger(app);
  }

  await app.listen(3001);
}

bootstrap();
