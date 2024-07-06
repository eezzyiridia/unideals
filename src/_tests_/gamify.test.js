
const Challenge = require("../models/challenge");
const UserChallenge = require("../models/userChallenge");
const Leader = require("../models/leader");
const Product = require("../models/product");
const ErrorResponse = require("../utils/errorResponse");
const {userChallenge} = require("../controllers/gamify")








jest.mock("../utils/errorResponse");

jest.mock("../models/challenge", () => ({
    findById: jest.fn(),
    create: jest.fn(),
  }));

  jest.mock("../models/userChallenge", () => ({
    findOne: jest.fn(),
    create: jest.fn(),
  }));

  jest.mock("../models/product", () => ({
    findById: jest.fn(),
    create: jest.fn(),
  }));

  jest.mock("../models/leader", () => ({
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
  }));

  

const mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const next = jest.fn();

describe("userChallenge", () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { userId: "user123" },
      params: { challengeId: "challenge123", productId: "product123" },
      body: { comment: "This is a comment" },
    };
    res = mockResponse;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 404 if challenge does not exist", async () => {
    Challenge.findById.mockResolvedValueOnce(null);

    await userChallenge(req, res, next);

    expect(Challenge.findById).toHaveBeenCalledWith("challenge123");
    expect(next).toHaveBeenCalledWith(new ErrorResponse(`This challenge does not exist`, 404));
  });

  it("should return 404 if product does not exist", async () => {
    Challenge.findById.mockResolvedValueOnce({});
    Product.findById.mockResolvedValueOnce(null);

    await userChallenge(req, res, next);

    expect(Product.findById).toHaveBeenCalledWith("product123");
    expect(next).toHaveBeenCalledWith(new ErrorResponse(`Product not found`, 404));
  });

  it("should return 400 if user challenge is already completed", async () => {
    Challenge.findById.mockResolvedValueOnce({});
    Product.findById.mockResolvedValueOnce({});
    UserChallenge.findOne.mockResolvedValueOnce({ status: "Completed" });

    await userChallenge(req, res, next);

    expect(UserChallenge.findOne).toHaveBeenCalledWith({
      user: "user123",
      challenge: "challenge123",
    });
    expect(next).toHaveBeenCalledWith(new ErrorResponse(`you have completed this challenge`, 400));
  });

  it("should create a new user challenge if not exist", async () => {
    Challenge.findById.mockResolvedValueOnce({ target: 10 });
    Product.findById.mockResolvedValueOnce({});
    UserChallenge.findOne.mockResolvedValueOnce(null);
    UserChallenge.create.mockResolvedValueOnce({
      user: "user123",
      challenge: "challenge123",
      target: 10,
    });

    await userChallenge(req, res, next);

    expect(UserChallenge.create).toHaveBeenCalledWith({
      user: "user123",
      challenge: "challenge123",
      target: 10,
    });
  });

  it("should increment product likes for like challenge", async () => {
    Challenge.findById.mockResolvedValueOnce({ type: "Like", target: 10 });
    Product.findById.mockResolvedValueOnce({ like: 0 });
    UserChallenge.findOne.mockResolvedValueOnce(null);
    UserChallenge.create.mockResolvedValueOnce({
      user: "user123",
      challenge: "challenge123",
      target: 10,
    });

    await userChallenge(req, res, next);

    expect(Product.findById).toHaveBeenCalledWith("product123");
    expect(Product.findById.mock.calls[0][0].like).toBe(1);
  });

  it("should add comment to product for comment challenge", async () => {
    Challenge.findById.mockResolvedValueOnce({ type: "Comment", target: 10 });
    Product.findById.mockResolvedValueOnce({ comment: [] });
    UserChallenge.findOne.mockResolvedValueOnce(null);
    UserChallenge.create.mockResolvedValueOnce({
      user: "user123",
      challenge: "challenge123",
      target: 10,
    });

    await userChallenge(req, res, next);

    expect(Product.findById).toHaveBeenCalledWith("product123");
    expect(Product.findById.mock.calls[0][0].comment).toContain("This is a comment");
  });

  it("should update leaderboard if challenge is completed", async () => {
    Challenge.findById.mockResolvedValueOnce({ type: "Like", target: 1, points: 10 });
    Product.findById.mockResolvedValueOnce({ like: 0 });
    UserChallenge.findOne.mockResolvedValueOnce(null);
    UserChallenge.create.mockResolvedValueOnce({
      user: "user123",
      challenge: "challenge123",
      target: 1,
      progress: 0,
    });

    Leader.findOne.mockResolvedValueOnce({ user: "user123", points: 0 });
    Leader.find.mockResolvedValueOnce([{ user: "user123", points: 10 }]);
    global.io = { emit: jest.fn() };

    await userChallenge(req, res, next);

    expect(Leader.findOne).toHaveBeenCalledWith({ user: "user123" });
    expect(Leader.find).toHaveBeenCalled();
    expect(global.io.emit).toHaveBeenCalledWith("leaderboardUpdate", {
      leaders: [{ user: "user123", points: 10 }],
    });
  });
});
