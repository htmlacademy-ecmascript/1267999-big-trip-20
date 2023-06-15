import {filterRules} from '../utils/filter.js';

function generateFilters(points) {
  return Object.entries(filterRules)
    .map(([filterType, filterPoints]) => ({
      type: filterType,
      hasPoints: filterPoints(points).length > 0
    }));
}

export {generateFilters};
