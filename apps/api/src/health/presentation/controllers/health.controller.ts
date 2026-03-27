import { Controller, Get } from "@nestjs/common";
import {
  GetHealthUseCase,
  type HealthStatus,
} from "../../domain/use-cases/get-health.use-case.js";

@Controller("health")
export class HealthController {
  constructor(private readonly getHealth: GetHealthUseCase) {}

  @Get()
  check(): HealthStatus {
    return this.getHealth.execute();
  }
}
