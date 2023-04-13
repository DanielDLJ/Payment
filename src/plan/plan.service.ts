import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { CreatePlanDto } from "./dto/create-plan.dto";
import { UpdatePlanDto } from "./dto/update-plan.dto";
import { Plan } from "./entities/plan.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PlanStatus, canUpdateOrDeletePlan } from "./enum/plan-status.enum";

@Injectable()
export class PlanService {
  private readonly logger = new Logger(PlanService.name);
  constructor(
    @InjectRepository(Plan)
    private planRepository: Repository<Plan>,
  ) {}

  async create(createPlanDto: CreatePlanDto) {
    this.logger.log(
      { ...createPlanDto },
      `${this.findAll.name} - Starting logic to create a plan`,
    );
    const plan = this.planRepository.create(createPlanDto);
    const createdPlan = await this.planRepository.save(plan);
    this.logger.log(
      `${this.findAll.name} - Finished logic to create a plan with id: ${createdPlan.id}`,
    );
    return createdPlan;
  }

  async findAll() {
    this.logger.log(`${this.findAll.name} - Starting logic to find all plans`);
    const plans = await this.planRepository.find();

    this.logger.log(
      `${this.findAll.name} - Finished logic to find all ${plans.length} plans`,
    );
    return plans;
  }

  async findOne(id: number) {
    this.logger.log(
      `${this.findOne.name} - Starting logic to find plan with id: ${id}`,
    );

    const plan = await this.planRepository.findOneBy({ id });
    if (!plan) {
      this.logger.error(`${this.findOne.name} - Plan with id: ${id} not found`);
      throw new NotFoundException(`Plan with id: ${id} not found`);
    }

    this.logger.log(
      `${this.findOne.name} - Finished logic to find plan with id: ${id}`,
    );
    return plan;
  }

  async update(id: number, updatePlanDto: UpdatePlanDto) {
    this.logger.log(
      {
        ...updatePlanDto,
      },
      `${this.update.name} - Starting logic to update plan with id: ${id}`,
    );
    const plan = await this.findOne(id);

    if (!canUpdateOrDeletePlan(plan)) {
      this.logger.error(
        `${this.update.name} - Plan with id: ${id} cannot be updated`,
      );
      throw new BadRequestException(
        `Plan id: ${id} cannot be updated, status: ${plan.status}`,
      );
    }

    const updatedPlan = await this.planRepository.save({
      ...plan,
      ...updatePlanDto,
    });

    this.logger.log(
      `${this.update.name} - Finished logic to update plan with id: ${id}`,
    );
    return updatedPlan;
  }

  async remove(id: number) {
    this.logger.log(
      `${this.remove.name} - Starting logic to remove plan with id: ${id}`,
    );
    const plan = await this.findOne(id);

    if (!canUpdateOrDeletePlan(plan)) {
      this.logger.error(
        `${this.update.name} - Plan with id: ${id} cannot be deleted`,
      );
      throw new BadRequestException(
        `Plan id: ${id} cannot be deleted, status: ${plan.status}`,
      );
    }

    const removedPlan = await this.planRepository.save({
      ...plan,
      status: PlanStatus.DELETED,
    });

    this.logger.log(
      `${this.remove.name} - Finished logic to remove plan with id: ${id}`,
    );
    return removedPlan;
  }
}
