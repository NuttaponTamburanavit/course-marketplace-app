import { Module } from "@nestjs/common";
import { GetHealthUseCase } from "../domain/use-cases/get-health.use-case.js";
import { HealthController } from "../presentation/controllers/health.controller.js";

@Module({
  controllers: [HealthController],
  providers: [GetHealthUseCase],
})
export class HealthModule {}
