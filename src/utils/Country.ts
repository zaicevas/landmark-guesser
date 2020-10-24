import {Country} from '../constants/Game';
import {getRandomInt} from '.';

const countriesAmount = Object.keys(Country).length;

export const generateChoices = (
  amount: number,
  exclude?: Country,
): Country[] => {
  const countries: Country[] = [];

  for (let i = 0; i < Math.min(countriesAmount, amount); i++) {
    const getUniqueCountry = () => {
      let country = getRandomCountry();
      while (
        country === exclude ||
        countries.includes(country) ||
        country === Country.Nowhere_Land
      ) {
        country = getRandomCountry();
      }
      return country;
    };

    countries.push(getUniqueCountry());
  }

  return countries;
};

export const getCountryFromString = (country?: string): Country => {
  const countryParsed = country?.replace(' ', '_') as keyof typeof Country;

  if (countryParsed && !Country[countryParsed]) {
    console.log(`Add this country to the enum: ${country}.`);
    console.log(`Parsed as: ${countryParsed}.`);
  }
  return Country[countryParsed] || Country.Nowhere_Land;
};

const getRandomCountry = () => {
  const index = getRandomInt(countriesAmount);
  const countryKey = Object.keys(Country)[index] as keyof typeof Country;
  return Country[countryKey];
};
