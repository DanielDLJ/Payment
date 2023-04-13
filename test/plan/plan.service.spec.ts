import { Test, TestingModule } from "@nestjs/testing";
import { PlanService } from "../../src/plan/plan.service";
import { CreatePlanDto } from "../../src/plan/dto/create-plan.dto";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Plan } from "../../src/plan/entities/plan.entity";
import { PlanStatus } from "../../src/plan/enum/plan-status.enum";
import { UpdatePlanDto } from "src/plan/dto/update-plan.dto";

describe("PlanService", () => {
  let service: PlanService;

  const defaultPlan: Plan = {
    id: Date.now(),
    name: "Plan 1",
    description: "Description 1",
    price: 100,
    status: PlanStatus.ACTIVE,
    updatedAt: new Date(),
    createdAt: new Date(),
  };

  const expectedPlan: Plan = {
    id: expect.any(Number),
    name: expect.any(String),
    description: expect.any(String),
    price: expect.any(Number),
    status: expect.any(String),
    updatedAt: expect.any(Date),
    createdAt: expect.any(Date),
  };

  const mockPlanRepository = {
    create: jest
      .fn()
      .mockImplementation((createPlanDto: CreatePlanDto): Plan => {
        return {
          id: Date.now(),
          status: PlanStatus.ACTIVE,
          ...createPlanDto,
          updatedAt: new Date(),
          createdAt: new Date(),
        };
      }),
    save: jest.fn().mockImplementation((plan) =>
      Promise.resolve<Plan>({
        ...defaultPlan,
        ...plan,
      }),
    ),
    find: jest.fn().mockImplementation(() => Promise.resolve<Plan[]>([])),
    findOneBy: jest.fn().mockImplementation(({ id }) => {
      return Promise.resolve<Plan>({
        ...defaultPlan,
        id: id,
      });
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlanService,
        { provide: getRepositoryToken(Plan), useValue: mockPlanRepository },
      ],
    }).compile();

    service = module.get<PlanService>(PlanService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should create a new plan and return it", async () => {
    const createPlanDto: CreatePlanDto = {
      name: "Plan 1",
      description: "Description 1",
      price: 100,
    };

    const result = await service.create(createPlanDto);
    expect(result).toEqual({
      ...expectedPlan,
      status: PlanStatus.ACTIVE,
      ...createPlanDto,
    });
    expect(mockPlanRepository.create).toHaveBeenCalledWith(createPlanDto);
  });

  it("should get all plans", async () => {
    const allPlans = await service.findAll();

    expect(allPlans).toEqual([]);
    expect(mockPlanRepository.find).toHaveBeenCalled();
  });

  describe("findOne", () => {
    it("should throw an error if plan is not found", async () => {
      mockPlanRepository.findOneBy.mockImplementationOnce(() =>
        Promise.resolve(null),
      );
      await expect(service.findOne(1)).rejects.toThrow();
    });
    it("should get a plan by id", async () => {
      const id = 1;
      const plan = await service.findOne(id);

      console.log("plan", plan);
      expect(plan).toEqual({
        ...expectedPlan,
        id: id,
      });
      expect(mockPlanRepository.findOneBy).toHaveBeenCalled();
    });
  });
  describe("update", () => {
    const updatePlanDto: UpdatePlanDto = {
      name: "Plan to update",
    };
    it("should update a plan by id", async () => {
      const id = 1;
      const plan = await service.update(id, updatePlanDto);

      console.log("plan", plan);
      expect(plan).toEqual({
        ...expectedPlan,
        id: id,
        name: updatePlanDto.name,
      });
      expect(mockPlanRepository.save).toHaveBeenCalled();
      expect(mockPlanRepository.findOneBy).toHaveBeenCalled();
    });
    it("should throw an error if plan is not found", async () => {
      mockPlanRepository.findOneBy.mockImplementationOnce(() =>
        Promise.resolve(null),
      );
      await expect(service.update(1, updatePlanDto)).rejects.toThrow();
      expect(mockPlanRepository.findOneBy).toHaveBeenCalled();
    });
    it("should throw an error when trying to update a plan which is allready deleted", async () => {
      mockPlanRepository.findOneBy.mockImplementationOnce(() =>
        Promise.resolve({
          ...defaultPlan,
          status: PlanStatus.DELETED,
        }),
      );
      await expect(service.update(1, updatePlanDto)).rejects.toThrow();
      expect(mockPlanRepository.findOneBy).toHaveBeenCalled();
    });
  });
  describe("remove", () => {
    it("should delete a plan by id", async () => {
      const id = 1;
      const plan = await service.remove(id);

      expect(plan).toEqual({
        ...expectedPlan,
        id: id,
        status: PlanStatus.DELETED,
      });
      expect(mockPlanRepository.save).toHaveBeenCalled();
      expect(mockPlanRepository.findOneBy).toHaveBeenCalled();
    });
    it("should throw an error if plan is not found", async () => {
      mockPlanRepository.findOneBy.mockImplementationOnce(() =>
        Promise.resolve(null),
      );
      await expect(service.remove(1)).rejects.toThrow();
      expect(mockPlanRepository.findOneBy).toHaveBeenCalled();
    });

    it("should throw an error when trying to delete a plan which is allready deleted", async () => {
      mockPlanRepository.findOneBy.mockImplementationOnce(() =>
        Promise.resolve({
          ...defaultPlan,
          status: PlanStatus.DELETED,
        }),
      );
      await expect(service.remove(1)).rejects.toThrow();
      expect(mockPlanRepository.findOneBy).toHaveBeenCalled();
    });
  });
});
