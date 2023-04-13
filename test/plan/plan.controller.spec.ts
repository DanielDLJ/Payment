import { Test, TestingModule } from "@nestjs/testing";
import { PlanController } from "../../src/plan/plan.controller";
import { PlanService } from "../../src/plan/plan.service";
import { CreatePlanDto } from "../../src/plan/dto/create-plan.dto";
import { UpdatePlanDto } from "../../src/plan/dto/update-plan.dto";
import { PlanStatus } from "../../src/plan/enum/plan-status.enum";

describe("PlanController", () => {
  let controller: PlanController;

  const mockPlanService = {
    create: jest.fn((createPlanDto: CreatePlanDto) => {
      return {
        id: Date.now(),
        ...createPlanDto,
      };
    }),
    update: jest.fn((id: string, updatePlanDto: UpdatePlanDto) => {
      return {
        id: +id,
        ...updatePlanDto,
      };
    }),
    remove: jest.fn((id: string) => {
      return {
        id: +id,
        status: PlanStatus.DELETED,
      };
    }),
    findOne: jest.fn((id: string) => {
      return {
        id: +id,
      };
    }),
    findAll: jest.fn(() => {
      return [];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanController],
      providers: [PlanService],
    })
      .overrideProvider(PlanService)
      .useValue(mockPlanService)
      .compile();

    controller = module.get<PlanController>(PlanController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should create a plan", async () => {
    const createPlanDto: CreatePlanDto = {
      name: "Plan 1",
      description: "Description 1",
      price: 100,
    };

    const result = await controller.create(createPlanDto);
    expect(result).toEqual({
      id: expect.any(Number),
      ...createPlanDto,
    });
    expect(mockPlanService.create).toHaveBeenCalledWith(createPlanDto);
  });

  it("should update a plan", async () => {
    const updatePlanDto: UpdatePlanDto = {
      name: "Plan 1",
      description: "Description 1",
      price: 100,
    };

    const result = await controller.update("1", updatePlanDto);
    expect(result).toEqual({
      id: 1,
      ...updatePlanDto,
    });
    expect(mockPlanService.update).toHaveBeenCalled();
  });

  it("should delete a plan", async () => {
    const result = await controller.remove("1");
    expect(result.status).toEqual(PlanStatus.DELETED);
    expect(mockPlanService.remove).toHaveBeenCalled();
  });

  it("should get a plan by id", async () => {
    const result = await controller.findOne("1");
    expect(result.id).toEqual(1);
  });

  it("should get all plans", async () => {
    const result = await controller.findAll();
    expect(result).toEqual([]);
  });
});
