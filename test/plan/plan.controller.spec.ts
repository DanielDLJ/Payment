import { Test, TestingModule } from "@nestjs/testing";
import { PlanController } from "../../src/plan/plan.controller";

describe("PlanController", () => {
  let controller: PlanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanController],
    }).compile();

    controller = module.get<PlanController>(PlanController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
