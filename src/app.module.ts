import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseModule } from "./database/database.module";
import { PlanModule } from "./plan/plan.module";
import { LoggerModule } from "nestjs-pino";
import {
  CORRELATION_ID_HEADER,
  CorrelationIdMiddleware,
} from "./correlation-id/correlation-id.middleware";
import { Request } from "express";
import { ConfigModule } from "@nestjs/config";
import { configuration } from "./config/configuration";
import { UserModule } from "./user/user.module";
import { UserAddressModule } from "./user-address/user-address.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    PlanModule,
    DatabaseModule,
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: "pino-pretty",
          options: {
            messageKey: "message",
            translateTime: "yyyy-mm-dd'T'HH:MM:ss.l'Z'",
          },
        },
        messageKey: "message",
        nestedKey: "payloadd",
        customProps: (req: Request) => {
          return {
            correlationId: req.headers[CORRELATION_ID_HEADER],
          };
        },
        autoLogging: true,
        serializers: {
          req: () => {
            return undefined;
          },
          res: () => {
            return undefined;
          },
        },
      },
    }),
    UserModule,
    UserAddressModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CorrelationIdMiddleware)
      .forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}
