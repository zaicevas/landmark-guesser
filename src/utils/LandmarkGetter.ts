import {Country, Landmark, ERROR_LANDMARK} from '../constants/Game';
import {getRandomInt} from '.';
import {fetchImageInfo} from './UnsplashClient';
import {getCountryFromString} from './Country';

class LandmarkGetter {
  private futureImageIds: Promise<string[]>;
  private queriedImageIndexes: number[] = [];

  constructor(futureImageIds: Promise<string[]> = Promise.resolve([])) {
    this.futureImageIds = futureImageIds;
  }

  async getLandmarks(amount: number): Promise<Landmark[]> {
    const landmarks: Landmark[] = [];
    for (let i = 0; i < amount; i++) {
      const landmark = await this.getLandmark();
      landmarks.push(landmark);
    }
    return landmarks.filter((landmark) => landmark !== ERROR_LANDMARK);
  }

  async getLandmark(): Promise<Landmark> {
    let foundImageWithLocation = false;
    const imageIds = await this.futureImageIds;

    try {
      while (
        !foundImageWithLocation &&
        imageIds.length !== this.queriedImageIndexes.length
      ) {
        const idIndex = await this.getRandomUnqueriedImageIndex();
        const imageInfo = await fetchImageInfo(imageIds[idIndex]);
        const countryString = imageInfo.location?.country;
        const country = getCountryFromString(countryString);

        if (country !== Country.Nowhere_Land) foundImageWithLocation = true;

        this.queriedImageIndexes.push(idIndex);

        if (foundImageWithLocation) {
          return {
            imageUrl: imageInfo.urls.regular,
            country,
            authorName: imageInfo.user.name,
            authorUrl: imageInfo.user.links.html,
          };
        }
      }
    } catch (err) {
      if (err.response.status === 403) console.log('Out of free requests');
      return ERROR_LANDMARK;
    }
    return ERROR_LANDMARK;
  }

  private async getRandomUnqueriedImageIndex() {
    const indexesLength = (await this.futureImageIds).length;
    let randomInt = getRandomInt(indexesLength);

    while (this.queriedImageIndexes.includes(randomInt))
      randomInt = getRandomInt(indexesLength);

    return randomInt;
  }
}

export default LandmarkGetter;
