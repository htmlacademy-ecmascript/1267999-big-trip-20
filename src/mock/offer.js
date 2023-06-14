import {getRandomInteger} from '../utils/common.js';
import {Price} from '../const.js';

function generateOffer(type) {
  return {
    id: crypto.randomUUID(),
    title: `Offer ${type}`,
    price: getRandomInteger(Price.MIN, (Price.MAX))
  };
}

export {generateOffer};
