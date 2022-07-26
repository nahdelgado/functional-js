import { getModelAVariations, getModelBVariations } from './variationsRepository';

const recosTag = 'RECOS';
const filterTag = 'FILTER';
const logger = (tag) => (...args) => console.log(tag, ...args);
const recosLogger = logger(recosTag);
const filterLogger = logger(filterTag);

const getRecommendations = async (reqCategory) => {
  recosLogger('requested category:', reqCategory);
  const [variationsFromA, variationsFromB] = await Promise.all([
    getModelAVariations(),
    getModelBVariations(),
  ]);
  const variations = [...variationsFromA, ...variationsFromB];
  recosLogger('initial variation count:', variations.length);
  const categoryFilter = ({ category }) => {
    filterLogger('checked category:', category);
    return !reqCategory || category === reqCategory;
  };
  const priceFormatter = ({ price, ...rest }) => ({ ...rest, price: `€${price}` });
  const finalVariations = variations
    .filter(categoryFilter)
    .map(priceFormatter);
  recosLogger('final variation count:', finalVariations.length);
  return finalVariations;
};

export default getRecommendations;
