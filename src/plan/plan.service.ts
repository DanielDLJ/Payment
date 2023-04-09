import { Injectable, NotFoundException } from "@nestjs/common";
import { CreatePlanDto } from "./dto/create-plan.dto";
import { UpdatePlanDto } from "./dto/update-plan.dto";
import { Plan } from "./entities/plan.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PlanStatus } from "./enum/plan-status.enum";

@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(Plan)
    private planRepository: Repository<Plan>,
  ) {}

  create(createPlanDto: CreatePlanDto) {
    const newPlan = this.planRepository.create(createPlanDto);
    return this.planRepository.save(newPlan);
  }

  findAll() {
    return this.planRepository.find();
  }

  async findOne(id: number) {
    const plan = await this.planRepository.findOneBy({ id });
    if (!plan) throw new NotFoundException("Plan not found");

    return this.planRepository.findOneBy({ id });
  }

  async update(id: number, updatePlanDto: UpdatePlanDto) {
    const plan = await this.findOne(id);

    return this.planRepository.save({ ...plan, ...updatePlanDto });
  }

  async remove(id: number) {
    const plan = await this.findOne(id);

    return this.planRepository.save({ ...plan, status: PlanStatus.DELETED });
  }
}
