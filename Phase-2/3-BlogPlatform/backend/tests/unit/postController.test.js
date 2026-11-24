import { jest } from "@jest/globals";
import AppError from "../../utils/AppError.js";
import catchAsync from "../../utils/catchAsync.js";

describe("AppError", () => {
  it("marks 4xx errors as operational failures", () => {
    const error = new AppError("Not found", 404);

    expect(error.message).toBe("Not found");
    expect(error.statusCode).toBe(404);
    expect(error.status).toBe("fail");
    expect(error.isOperational).toBe(true);
    expect(error).toBeInstanceOf(Error);
  });

  it("marks 5xx errors as server errors", () => {
    const error = new AppError("Database unavailable", 503);

    expect(error.status).toBe("error");
    expect(error.statusCode).toBe(503);
  });
});

describe("catchAsync", () => {
  it("forwards a rejected promise to next", async () => {
    const failure = new Error("boom");
    const handler = catchAsync(async () => {
      throw failure;
    });

    const next = jest.fn();
    await handler({}, {}, next);

    expect(next).toHaveBeenCalledWith(failure);
  });

  it("resolves successfully without calling next", async () => {
    const handler = catchAsync(async (req, res) => {
      res.end("ok");
    });

    const next = jest.fn();
    const res = { end: jest.fn() };
    await handler({}, res, next);

    expect(res.end).toHaveBeenCalledWith("ok");
    expect(next).not.toHaveBeenCalled();
  });
});
