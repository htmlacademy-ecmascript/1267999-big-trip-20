import {getRandomInteger} from '../utils';
import {Price} from '../const';

function generateOffer(type) {
  return {
    id: crypto.randomUUID(),
    title: `Offer ${type}`,
    price: getRandomInteger(Price.MIN, (Price.MAX))
  };
}

export {generateOffer};
