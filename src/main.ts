import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger, LoggerErrorInterceptor } from "nestjs-pino";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  app.flushLogs();

  const config = new DocumentBuilder()
    .setTitle("Payment")
    .setDescription("Payment management service")
    .setContact("Daniel Leme Junior", "", "daniel.dlj@hotmail.com")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("swagger", app, document);

  await app.listen(3001);
}

bootstrap();
