import { Plan } from "../entities/plan.entity";

export enum PlanStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  DELETED = "DELETED",
}

export function canUpdateOrDeletePlan(plan: Plan): boolean {
  return (
    plan.status === PlanStatus.ACTIVE || plan.status === PlanStatus.INACTIVE
  );
}
