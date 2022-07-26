import getRecommendations from '../src/recommendations';
import { getModelAVariations, getModelBVariations } from '../src/variationsRepository';

jest.mock('../src/variationsRepository');

describe('getRecommendations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getModelAVariations.mockResolvedValue([]);
    getModelBVariations.mockResolvedValue([]);
  });

  it('should recommend all variations by default', async () => {
    const variations = [
      { title: 'Dress', category: 'Clothes' },
      { title: 'Washing Machine', category: 'Appliances' },
    ];
    getModelAVariations.mockResolvedValue(variations);

    const recos = await getRecommendations();

    expect(recos).toHaveLength(2);
    expect(recos).toEqual(expect.arrayContaining([
      expect.objectContaining({ title: 'Dress' }),
      expect.objectContaining({ title: 'Washing Machine' }),
    ]));
  });

  it('should only recommend variations for given category', async () => {
    const variations = [
      { title: 'Dress', category: 'Clothes' },
      { title: 'Shoes', category: 'Clothes' },
      { title: 'Washing Machine', category: 'Appliances' },
    ];
    getModelAVariations.mockResolvedValue(variations);

    const recos = await getRecommendations('Clothes');

    expect(recos).toHaveLength(2);
    expect(recos).toEqual(expect.arrayContaining([
      expect.objectContaining({ title: 'Dress' }),
      expect.objectContaining({ title: 'Shoes' }),
    ]));
  });

  it('should format prices', async () => {
    const variations = [
      { price: 23 },
    ];
    getModelAVariations.mockResolvedValue(variations);

    const recos = await getRecommendations();

    expect(recos).toEqual(expect.arrayContaining([
      expect.objectContaining({ price: '€23' }),
    ]));
  });

  it('should recommend variations from models A and B', async () => {
    const variationsFromA = [
      { title: 'Dress' },
    ];
    getModelAVariations.mockResolvedValue(variationsFromA);
    const variationsFromB = [
      { title: 'Tie-dye hoodie' },
    ];
    getModelBVariations.mockResolvedValue(variationsFromB);

    const recos = await getRecommendations();

    expect(recos).toEqual(expect.arrayContaining([
      expect.objectContaining({ title: 'Dress' }),
      expect.objectContaining({ title: 'Tie-dye hoodie' }),
    ]));
  });

  it('should print useful logs', async () => {
    const variationsFromA = [
      { category: 'Clothes' },
      { category: 'Appliances' },
    ];
    getModelAVariations.mockResolvedValue(variationsFromA);
    const spy = jest.spyOn(console, 'log');
    expect(spy).not.toHaveBeenCalled();

    await getRecommendations('Clothes');

    expect(spy).toHaveBeenNthCalledWith(1, 'RECOS', 'requested category:', 'Clothes');
    expect(spy).toHaveBeenNthCalledWith(2, 'RECOS', 'initial variation count:', 2);
    expect(spy).toHaveBeenNthCalledWith(3, 'FILTER', 'checked category:', 'Clothes');
    expect(spy).toHaveBeenNthCalledWith(4, 'FILTER', 'checked category:', 'Appliances');
    expect(spy).toHaveBeenNthCalledWith(5, 'RECOS', 'final variation count:', 1);
  });
});
