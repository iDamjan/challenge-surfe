import { jest } from "@jest/globals";

// Create mock functions
const mockActionRepository = {
  filterUserActions: jest.fn(),
};

const mockUserRepository = {
  findAll: jest.fn(),
};

// Mock the modules before importing the service
jest.unstable_mockModule("../../../repositories/actionRepository.js", () => ({
  default: mockActionRepository,
}));

jest.unstable_mockModule("../../../repositories/userRepository.js", () => ({
  default: mockUserRepository,
}));

const { calculateReferralIndex } = await import("../../referralService.js");

describe("ReferralService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("calculateReferralIndex", () => {
    it("should calculate referral index for users with no referrals", async () => {
      // Arrange
      const mockUsers = [
        { id: 1, username: "user1" },
        { id: 2, username: "user2" },
      ];
      const mockActions = [];

      mockUserRepository.findAll.mockResolvedValue(mockUsers);
      mockActionRepository.filterUserActions.mockResolvedValue(mockActions);

      // Act
      const result = await calculateReferralIndex();

      // Assert
      expect(result).toEqual({
        1: 0,
        2: 0,
      });
      expect(mockUserRepository.findAll).toHaveBeenCalledTimes(1);
      expect(mockActionRepository.filterUserActions).toHaveBeenCalledWith({
        key: "type",
        value: "REFER_USER",
      });
    });

    it("should calculate referral index for users with direct referrals only", async () => {
      // Arrange
      const mockUsers = [
        { id: 1, username: "user1" },
        { id: 2, username: "user2" },
        { id: 3, username: "user3" },
      ];
      const mockActions = [
        { userId: 1, targetUser: 2, type: "REFER_USER" },
        { userId: 1, targetUser: 3, type: "REFER_USER" },
      ];

      mockUserRepository.findAll.mockResolvedValue(mockUsers);
      mockActionRepository.filterUserActions.mockResolvedValue(mockActions);

      // Act
      const result = await calculateReferralIndex();

      // Assert
      expect(result).toEqual({
        1: 2,
        2: 0,
        3: 0,
      });
    });

    it("should calculate referral index with indirect referrals (multi-level)", async () => {
      // Arrange
      const mockUsers = [
        { id: 1, username: "user1" },
        { id: 2, username: "user2" },
        { id: 3, username: "user3" },
        { id: 4, username: "user4" },
      ];
      const mockActions = [
        { userId: 1, targetUser: 2, type: "REFER_USER" },
        { userId: 2, targetUser: 3, type: "REFER_USER" },
        { userId: 3, targetUser: 4, type: "REFER_USER" },
      ];

      mockUserRepository.findAll.mockResolvedValue(mockUsers);
      mockActionRepository.filterUserActions.mockResolvedValue(mockActions);

      // Act
      const result = await calculateReferralIndex();

      // Assert
      expect(result).toEqual({
        1: 3,
        2: 2,
        3: 1,
        4: 0,
      });
    });

    it("should handle complex referral networks with multiple branches", async () => {
      // Arrange
      const mockUsers = [
        { id: 1, username: "user1" },
        { id: 2, username: "user2" },
        { id: 3, username: "user3" },
        { id: 4, username: "user4" },
        { id: 5, username: "user5" },
      ];
      const mockActions = [
        { userId: 1, targetUser: 2, type: "REFER_USER" },
        { userId: 1, targetUser: 3, type: "REFER_USER" },
        { userId: 2, targetUser: 4, type: "REFER_USER" },
        { userId: 3, targetUser: 5, type: "REFER_USER" },
      ];

      mockUserRepository.findAll.mockResolvedValue(mockUsers);
      mockActionRepository.filterUserActions.mockResolvedValue(mockActions);

      // Act
      const result = await calculateReferralIndex();

      // Assert
      expect(result).toEqual({
        1: 4,
        2: 1,
        3: 1,
        4: 0,
        5: 0,
      });
    });

    it("should prevent counting cycles in referral chains", async () => {
      // Arrange
      const mockUsers = [
        { id: 1, username: "user1" },
        { id: 2, username: "user2" },
        { id: 3, username: "user3" },
      ];
      const mockActions = [
        { userId: 1, targetUser: 2, type: "REFER_USER" },
        { userId: 2, targetUser: 3, type: "REFER_USER" },
        { userId: 3, targetUser: 1, type: "REFER_USER" },
      ];

      mockUserRepository.findAll.mockResolvedValue(mockUsers);
      mockActionRepository.filterUserActions.mockResolvedValue(mockActions);

      // Act
      const result = await calculateReferralIndex();

      // Assert
      expect(result).toEqual({
        1: 3,
        2: 3,
        3: 3,
      });
    });

    it("should ignore self-referrals", async () => {
      // Arrange
      const mockUsers = [
        { id: 1, username: "user1" },
        { id: 2, username: "user2" },
      ];
      const mockActions = [
        { userId: 1, targetUser: 1, type: "REFER_USER" },
        { userId: 1, targetUser: 2, type: "REFER_USER" },
        { userId: 2, targetUser: 2, type: "REFER_USER" },
      ];

      mockUserRepository.findAll.mockResolvedValue(mockUsers);
      mockActionRepository.filterUserActions.mockResolvedValue(mockActions);

      // Act
      const result = await calculateReferralIndex();

      // Assert
      expect(result).toEqual({
        1: 1,
        2: 0,
      });
    });

    it("should handle users with duplicate referral actions", async () => {
      // Arrange
      const mockUsers = [
        { id: 1, username: "user1" },
        { id: 2, username: "user2" },
      ];
      const mockActions = [
        { userId: 1, targetUser: 2, type: "REFER_USER" },
        { userId: 1, targetUser: 2, type: "REFER_USER" },
        { userId: 1, targetUser: 2, type: "REFER_USER" },
      ];

      mockUserRepository.findAll.mockResolvedValue(mockUsers);
      mockActionRepository.filterUserActions.mockResolvedValue(mockActions);

      // Act
      const result = await calculateReferralIndex();

      // Assert
      expect(result).toEqual({
        1: 1,
        2: 0,
      });
    });

    it("should handle empty user list", async () => {
      // Arrange
      mockUserRepository.findAll.mockResolvedValue([]);
      mockActionRepository.filterUserActions.mockResolvedValue([]);

      // Act
      const result = await calculateReferralIndex();

      // Assert
      expect(result).toEqual({});
    });

    it("should handle users that exist in actions but not in user list", async () => {
      // Arrange
      const mockUsers = [{ id: 1, username: "user1" }];
      const mockActions = [
        { userId: 1, targetUser: 999, type: "REFER_USER" }, // user 999 doesn't exist
      ];

      mockUserRepository.findAll.mockResolvedValue(mockUsers);
      mockActionRepository.filterUserActions.mockResolvedValue(mockActions);

      // Act
      const result = await calculateReferralIndex();

      // Assert
      expect(result).toEqual({
        1: 1, // user1 still gets credit for the referral
      });
    });

    it("should propagate repository errors", async () => {
      // Arrange
      const error = new Error("Database connection failed");
      mockUserRepository.findAll.mockRejectedValue(error);

      // Act & Assert
      await expect(calculateReferralIndex()).rejects.toThrow(
        "Database connection failed"
      );
    });

    it("should propagate action repository errors", async () => {
      // Arrange
      const mockUsers = [{ id: 1, username: "user1" }];
      const error = new Error("Failed to fetch actions");

      mockUserRepository.findAll.mockResolvedValue(mockUsers);
      mockActionRepository.filterUserActions.mockRejectedValue(error);

      // Act & Assert
      await expect(calculateReferralIndex()).rejects.toThrow(
        "Failed to fetch actions"
      );
    });

    it("should handle large referral networks efficiently", async () => {
      // Arrange - Create a larger network to test performance
      const mockUsers = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        username: `user${i + 1}`,
      }));

      // Create a chain: user1 -> user2 -> user3 -> ... -> user100
      const mockActions = Array.from({ length: 99 }, (_, i) => ({
        userId: i + 1,
        targetUser: i + 2,
        type: "REFER_USER",
      }));

      mockUserRepository.findAll.mockResolvedValue(mockUsers);
      mockActionRepository.filterUserActions.mockResolvedValue(mockActions);

      // Act
      const startTime = Date.now();
      const result = await calculateReferralIndex();
      const endTime = Date.now();

      // Assert
      expect(result[1]).toBe(99); // user1 should have 99 total referrals
      expect(result[50]).toBe(50); // user50 should have 50 referrals
      expect(result[100]).toBe(0); // user100 should have 0 referrals
      expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
    });

    it("should handle mixed referral patterns correctly", async () => {
      // Arrange - Complex scenario with multiple patterns
      const mockUsers = [
        { id: 1, username: "user1" },
        { id: 2, username: "user2" },
        { id: 3, username: "user3" },
        { id: 4, username: "user4" },
        { id: 5, username: "user5" },
        { id: 6, username: "user6" },
      ];
      const mockActions = [
        // Chain: 1 -> 2 -> 3
        { userId: 1, targetUser: 2, type: "REFER_USER" },
        { userId: 2, targetUser: 3, type: "REFER_USER" },

        // Branch: 1 -> 4 -> 5
        { userId: 1, targetUser: 4, type: "REFER_USER" },
        { userId: 4, targetUser: 5, type: "REFER_USER" },

        // Cross-reference: 3 -> 6
        { userId: 3, targetUser: 6, type: "REFER_USER" },
      ];

      mockUserRepository.findAll.mockResolvedValue(mockUsers);
      mockActionRepository.filterUserActions.mockResolvedValue(mockActions);

      // Act
      const result = await calculateReferralIndex();

      // Assert
      expect(result).toEqual({
        1: 5,
        2: 2,
        3: 1,
        4: 1,
        5: 0,
        6: 0,
      });
    });
  });
});
