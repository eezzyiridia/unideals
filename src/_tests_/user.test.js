const { registerUser } = require("../controllers/user");
const { registrationSchema } = require("../validation/user");
const { hashPassword } = require("../utils/hashPassword");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/user");

const mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const next = jest.fn();

jest.mock("../utils/hashPassword", () => ({
  hashPassword: jest.fn(() => `Password123`),
}));

jest.mock("../validation/user", () => ({
  registrationSchema: {
    validate: jest.fn().mockReturnValue({ error: null }),
  },
}));

jest.mock("../utils/errorResponse", () => {
  return jest.fn().mockImplementation((message, statusCode) => ({
    message,
    statusCode,
  }));
});

jest.mock("../models/user", () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

describe("create user", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should throw validation error", async () => {
    registrationSchema.validate.mockReturnValueOnce({
      error: { details: [{ message: "Validation error" }] },
    });

    const mockRequest = {
      body: {
        fullName: "test user",
        phoneNumber: "12345678",
      },
    };

    await registerUser(mockRequest, mockResponse, next);

    expect(registrationSchema.validate).toHaveBeenCalledWith(mockRequest.body);
    expect(next).toHaveBeenCalledWith(
      new ErrorResponse("Validation error", 400)
    );
    expect(User.create).not.toHaveBeenCalled();
  });

  it("should save a user", async () => {
    const mockRequest = {
      body: {
        fullName: "test user",
        phoneNumber: "12345678",
        nationality: "email",
        password: "Password123",
        email: "test@example.com",
      },
    };

    registrationSchema.validate.mockReturnValueOnce({ error: null });
    User.findOne.mockResolvedValueOnce(null);
    User.create.mockResolvedValueOnce(mockRequest.body);

    await registerUser(mockRequest, mockResponse, next);
    expect(User.findOne).toHaveBeenCalledWith({
      email: mockRequest.body.email,
    });
    expect(hashPassword).toHaveBeenCalledWith(mockRequest.body.password, 12);
    expect(hashPassword).toHaveReturnedWith("Password123");
    expect(User.create).toHaveBeenCalled();
  });
});
