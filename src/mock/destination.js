import {getRandomArrayElement} from '../utils/common.js';
import {CITIES, DESCRIPTION} from '../const.js';

function generateDestination() {
  const city = getRandomArrayElement(CITIES);
  const description = getRandomArrayElement(DESCRIPTION);

  return {
    id: crypto.randomUUID(),
    name: city,
    description: description,
    pictures: [
      {
        'src': `https://loremflickr.com/248/152?random=${crypto.randomUUID()}`,
        'description': `${city} description`
      }
    ]
  };
}

export {generateDestination};
