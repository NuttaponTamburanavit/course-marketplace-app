import { join } from "path";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppConfigService } from "../config/app-config.service.js";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        type: "postgres" as const,
        url: config.databaseUrl,
        entities: [join(__dirname, "/../**/*.entity{.ts,.js}")],
        migrations: [join(__dirname, "/migrations/*{.ts,.js}")],
        synchronize: false,
        logging: process.env["NODE_ENV"] === "development",
      }),
    }),
  ],
})
export class DatabaseModule {}
