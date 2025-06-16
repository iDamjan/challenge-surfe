import { jest } from "@jest/globals";
import Fastify from "fastify";

// Mock data - matching the user schema requirements
const mockUsers = [
  { id: 1, name: "John Doe", createdAt: "2024-01-01T00:00:00Z" },
  { id: 2, name: "Jane Smith", createdAt: "2024-01-02T00:00:00Z" },
];

const mockActions = [
  { userId: 1, targetUser: 2, type: "REFER_USER" },
  { userId: 2, targetUser: 1, type: "REFER_USER" },
];

// Mock repositories
const mockUserRepository = {
  findById: jest.fn(),
  findAll: jest.fn(),
};

const mockActionRepository = {
  filterUserActions: jest.fn(),
};

// Mock the repository modules
jest.unstable_mockModule("../../../repositories/userRepository.js", () => ({
  default: mockUserRepository,
}));

jest.unstable_mockModule("../../../repositories/actionRepository.js", () => ({
  default: mockActionRepository,
}));

const { handleGetUserById, handleGetTotalReferredUsers } = await import(
  "../../userController.js"
);

describe("UserController Integration Tests", () => {
  let fastify;

  beforeEach(async () => {
    // Reset mocks
    jest.clearAllMocks();

    mockUserRepository.findById.mockImplementation((id) => {
      return mockUsers.find((user) => user.id === parseInt(id)) || null;
    });

    mockUserRepository.findAll.mockResolvedValue(mockUsers);

    mockActionRepository.filterUserActions.mockImplementation(
      ({ key, value }) => {
        if (key === "type" && value === "REFER_USER") {
          return mockActions;
        }
        return [];
      }
    );

    fastify = Fastify({ logger: false });

    // Register routes
    fastify.get("/users/:id", handleGetUserById);
    fastify.get("/referrals", handleGetTotalReferredUsers);

    await fastify.ready();
  });

  afterEach(async () => {
    await fastify.close();
  });

  describe("GET /users/:id", () => {
    it("should return user data for valid user ID", async () => {
      // Act
      const response = await fastify.inject({
        method: "GET",
        url: "/users/1",
      });

      // Assert
      expect(response.statusCode).toBe(200);
      const responseData = JSON.parse(response.body);
      expect(responseData.success).toBe(true);
      expect(responseData.data).toEqual({
        id: 1,
        name: "John Doe",
        createdAt: "2024-01-01T00:00:00Z",
      });
      expect(mockUserRepository.findById).toHaveBeenCalledWith(1);
    });

    it("should return 400 for non-existent user (ZodError on null)", async () => {
      // Act
      const response = await fastify.inject({
        method: "GET",
        url: "/users/999",
      });

      // Assert
      expect(response.statusCode).toBe(400);
      const responseData = JSON.parse(response.body);
      expect(responseData.error).toBe("Validation failed");
      expect(responseData.type).toBe("ValidationError");
      expect(responseData.details).toBeDefined();
      expect(mockUserRepository.findById).toHaveBeenCalledWith(999);
    });

    it("should return 400 for invalid user ID format", async () => {
      // Act
      const response = await fastify.inject({
        method: "GET",
        url: "/users/invalid",
      });

      // Assert
      expect(response.statusCode).toBe(400);
      const responseData = JSON.parse(response.body);
      expect(responseData.error).toContain("User ID must be a positive number");
      expect(responseData.type).toBe("ValidationError");
      // Should not call repository for invalid input
      expect(mockUserRepository.findById).not.toHaveBeenCalled();
    });

    it("should return 400 for negative user ID", async () => {
      // Act
      const response = await fastify.inject({
        method: "GET",
        url: "/users/-1",
      });

      // Assert
      expect(response.statusCode).toBe(400);
      const responseData = JSON.parse(response.body);
      expect(responseData.error).toContain("User ID must be a positive number");
      expect(responseData.type).toBe("ValidationError");
      // Should not call repository for invalid input
      expect(mockUserRepository.findById).not.toHaveBeenCalled();
    });
  });

  describe("GET /referrals", () => {
    it("should return referral index for all users", async () => {
      // Act
      const response = await fastify.inject({
        method: "GET",
        url: "/referrals",
      });

      // Assert
      expect(response.statusCode).toBe(200);
      const responseData = JSON.parse(response.body);
      expect(responseData.success).toBe(true);
      expect(responseData.data).toEqual({
        1: 2,
        2: 2,
      });
      expect(mockUserRepository.findAll).toHaveBeenCalled();
      expect(mockActionRepository.filterUserActions).toHaveBeenCalledWith({
        key: "type",
        value: "REFER_USER",
      });
    });

    it("should handle empty referral data gracefully", async () => {
      mockActionRepository.filterUserActions.mockResolvedValue([]);

      // Act
      const response = await fastify.inject({
        method: "GET",
        url: "/referrals",
      });

      // Assert
      expect(response.statusCode).toBe(200);
      const responseData = JSON.parse(response.body);
      expect(responseData.success).toBe(true);
      expect(responseData.data).toEqual({
        1: 0,
        2: 0,
      });
    });
  });
});
