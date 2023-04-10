import { CorrelationIdMiddleware } from "../../src/correlation-id/correlation-id.middleware";

describe("CorrelationIdMiddleware", () => {
  it("should be defined", () => {
    expect(new CorrelationIdMiddleware()).toBeDefined();
  });
});
