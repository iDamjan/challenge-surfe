import actionRepository from "../repositories/actionRepository.js";
import userRepository from "../repositories/userRepository.js";

/**
 * @description Calculate the referral index
 * @returns {Promise<{ [key: string]: number }>}
 */
export async function calculateReferralIndex() {
  try {
    const users = await userRepository.findAll();
    const referralActions = await getReferralActions();
    const referralGraph = buildReferralGraph(referralActions);

    const referralIndex = {};

    for (const user of users) {
      const referralCount = calculateUserReferralCount(
        user.id,
        referralGraph,
        new Set()
      );

      referralIndex[user.id] = referralCount;
    }
    return referralIndex;
  } catch (error) {
    throw error;
  }
}

// -------------- LOCAL FUNCTIONS --------------

/**
 * @description Get the referral actions
 * @returns {Promise<Action[]>}
 */
async function getReferralActions() {
  const referralActions = actionRepository.filterUserActions({
    key: "type",
    value: "REFER_USER",
  });
  return referralActions;
}

/**
 * @description Build the referral graph
 * @param {Action[]} referralActions
 * @returns {Map<number, Set<number>>}
 */
function buildReferralGraph(referralActions) {
  const graph = new Map();

  for (const action of referralActions) {
    const referrer = action.userId;
    const referred = action.targetUser;

    // Prevent self-referrals counts
    if (referrer === referred) {
      continue;
    }

    if (!graph.has(referrer)) {
      graph.set(referrer, new Set());
    }

    graph.get(referrer).add(referred);
  }

  return graph;
}

/**
 * @description Calculate the user referral count
 * @param {number} userId
 * @param {Map<number, Set<number>>} graph
 * @param {Set<number>} visited
 * @returns {number}
 */
function calculateUserReferralCount(userId, graph, visited) {
  if (visited.has(userId)) {
    return 0;
  }

  if (!graph.has(userId)) {
    return 0;
  }

  visited.add(userId);

  let totalReferrals = 0;
  const directReferrals = graph.get(userId);

  totalReferrals += directReferrals.size;

  for (const referredUserId of directReferrals) {
    const indirectReferrals = calculateUserReferralCount(
      referredUserId,
      graph,
      new Set(visited)
    );
    totalReferrals += indirectReferrals;
  }

  return totalReferrals;
}
