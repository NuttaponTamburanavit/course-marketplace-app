export interface HealthStatus {
  readonly status: "ok";
  readonly timestamp: string;
}

export class GetHealthUseCase {
  execute(): HealthStatus {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
    };
  }
}
