import {
  CORRELATION_ID_HEADER,
  CorrelationIdMiddleware,
} from "../../src/correlation-id/correlation-id.middleware";
import { Request, Response } from "express";

describe("CorrelationIdMiddleware", () => {
  it("should be defined", () => {
    expect(new CorrelationIdMiddleware()).toBeDefined();
  });
  it("should set the correlation id header", () => {
    const req = {
      headers: {},
    } as unknown as Request;
    const res = {
      set: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    const correlationIdMiddleware = new CorrelationIdMiddleware();
    correlationIdMiddleware.use(req, res, next);

    expect(req.headers[CORRELATION_ID_HEADER]).toBeDefined();
    expect(typeof req.headers[CORRELATION_ID_HEADER]).toBe("string");
    expect(res.set).toHaveBeenCalled();
  });
});
