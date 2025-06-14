import actionRepository from "../repositories/actionRepository.js";

export async function getUserActionCount(userId) {
  try {
    const count = await actionRepository.getAllUserActions(userId);
    return { count };
  } catch (error) {
    return { error: "Error counting user actions" };
  }
}

export async function calculateNextActionProbability(currentAction) {
  const allActions = await actionRepository.findAll();

  const userSequences = groupActionsByUser(allActions);

  const nextActions = findNextActions(userSequences, currentAction);

  const probabilities = calculateProbabilities(nextActions, currentAction);

  return probabilities;
}

function groupActionsByUser(actions) {
  const userActions = {};

  actions.forEach((action) => {
    if (!userActions[action.userId]) {
      userActions[action.userId] = [];
    }
    userActions[action.userId].push(action);
  });

  Object.values(userActions).forEach((userActionList) => {
    userActionList.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
  });

  return Object.values(userActions);
}

function findNextActions(userSequences, currentAction) {
  const nextActions = [];

  userSequences.forEach((userActions) => {
    for (let i = 0; i < userActions.length - 1; i++) {
      if (userActions[i].type === currentAction) {
        nextActions.push(userActions[i + 1].type);
      }
    }
  });

  return nextActions;
}

function calculateProbabilities(nextActions, currentAction) {
  if (nextActions.length === 0) {
    return {};
  }

  const actionCounts = {};
  nextActions.forEach((action) => {
    actionCounts[action] = (actionCounts[action] || 0) + 1;
  });

  // Remove the current action from the results if it exists
  delete actionCounts[currentAction];

  const total = nextActions.filter((action) => action !== currentAction).length;

  if (total === 0) {
    return {};
  }

  const probabilities = {};

  for (const [action, count] of Object.entries(actionCounts)) {
    probabilities[action] = parseFloat((count / total).toFixed(2));
  }

  return probabilities;
}
