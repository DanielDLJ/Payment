import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
} from "@nestjs/common";
import { PlanService } from "./plan.service";
import { CreatePlanDto } from "./dto/create-plan.dto";
import { UpdatePlanDto } from "./dto/update-plan.dto";

@Controller("plan")
export class PlanController {
  private readonly logger = new Logger(PlanController.name);
  constructor(private readonly planService: PlanService) {}

  @Post()
  async create(@Body() createPlanDto: CreatePlanDto) {
    this.logger.log("Starting to create plan");
    const createdPlan = await this.planService.create(createPlanDto);
    this.logger.log(`Finished creating plan with id: ${createdPlan.id}`);
    return createdPlan;
  }

  @Get()
  async findAll() {
    this.logger.log("Starting to find all plans");
    const plans = await this.planService.findAll();
    this.logger.log(`Finished finding all ${plans.length} plans`);
    return plans;
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    this.logger.log(`Starting to find plan with id: ${id} `);
    const plan = await this.planService.findOne(+id);
    this.logger.log(`Finished finding plan ${plan.id}`);
    return plan;
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() updatePlanDto: UpdatePlanDto) {
    this.logger.log(`Starting to update plan with id: ${id}`);
    const updatePlan = await this.planService.update(+id, updatePlanDto);
    this.logger.log(`Finished updating plan ${updatePlan.id}`);
    return updatePlan;
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    this.logger.log(`Starting to remove plan with id: ${id}`);
    const removedPlan = await this.planService.remove(+id);
    this.logger.log(`Finished removing plan ${removedPlan.id}`);
    return removedPlan;
  }
}
