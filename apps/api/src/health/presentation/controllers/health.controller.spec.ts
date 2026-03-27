import { Test } from "@nestjs/testing";
import { HealthController } from "./health.controller.js";
import { GetHealthUseCase } from "../../domain/use-cases/get-health.use-case.js";

describe("HealthController", () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [GetHealthUseCase],
    }).compile();

    controller = module.get(HealthController);
  });

  describe("check", () => {
    it("when called, expect status ok with an ISO timestamp", () => {
      // Act
      const result = controller.check();

      // Assert
      expect(result.status).toBe("ok");
      expect(typeof result.timestamp).toBe("string");
      expect(new Date(result.timestamp).toISOString()).toBe(result.timestamp);
    });
  });
});
