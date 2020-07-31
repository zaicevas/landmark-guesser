import {Country} from '../constants/Game';
import {generateChoices} from './Country';
import _ from 'lodash';

const isArrayUnique = <T>(arr: T[]) => new Set(arr).size === arr.length;

const expectExclusion = (country: Country) => {
  expect(generateChoices(2, country)).not.toContain(country);
};

describe('generateChoices() should return random, unique countries', () => {
  it('should return empty array', () => {
    expect(generateChoices(0)).toStrictEqual([]);
    expect(generateChoices(0, Country.Italy)).toStrictEqual([]);
  });

  it('should not return excluded country', () => {
    expectExclusion(Country.France);
    expectExclusion(Country.Italy);
    expectExclusion(Country.USA);
  });

  it('should return unique countries', () => {
    const countries = generateChoices(3);

    expect(countries).toHaveLength(3);
    expect(isArrayUnique(countries)).toBeTruthy();
  });

  // TODO: improve test by using mock seed
  it('should not return Nowhere Land', () => {
    _.times(100, () => {
      const countries = generateChoices(10);
      expect(countries).not.toContain(Country.Nowhere_Land);
    });
  });
});
