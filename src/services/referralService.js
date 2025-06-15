import actionRepository from "../repositories/actionRepository.js";

export async function calculateReferralIndex() {}

// -------------- LOCAL FUNCTIONS --------------
async function getReferralActions() {
  const referralActions = actionRepository.filterUserActions({
    key: "type",
    value: "REFER_USER",
  });
  return referralActions;
}
function buildReferralGraph(referralActions) {}
function calculateUserReferralCount(userId, graph, visited = new Set()) {}
