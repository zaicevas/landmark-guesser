import LandmarkGetter from './LandmarkGetter';
import {Country, Landmark} from '../constants/Game';
import axios from 'axios';
import _ from 'lodash';

jest.mock('axios');
const mockAxios = axios as jest.Mocked<typeof axios>;

let landmarkGetter: LandmarkGetter;

const generateDuplicates = (amount: number, landmark: Landmark) => {
  const duplicates = [];
  for (let i = 0; i < amount; i++) duplicates.push(landmark);
  return duplicates;
};

beforeEach(() => {
  landmarkGetter = new LandmarkGetter();
});

describe('getLandmarks should filter images without location and return correct landmarks', () => {
  beforeEach(() => {
    landmarkGetter = new LandmarkGetter(Promise.resolve(['id1', 'id2']));
  });

  it('should return all landmarks with locations', async () => {
    landmarkGetter = new LandmarkGetter(
      Promise.resolve(['id1', 'id2', 'id3', 'id4']),
    );
    const response = {
      data: {
        location: {
          country: Country.Spain,
        },
        urls: {
          regular: '',
        },
      },
    };
    mockAxios.get.mockResolvedValue(response);

    const landmarks = await landmarkGetter.getLandmarks(4);

    const landmark = {
      imageUrl: '',
      country: Country.Spain,
    };

    const expectedResult = generateDuplicates(4, landmark);

    expect(landmarks).toEqual(expectedResult);
  });

  it('should not return landmarks without location', async () => {
    const response = {
      data: {
        urls: {
          regular: '',
        },
      },
    };
    mockAxios.get.mockResolvedValue(response);

    const landmarks = await landmarkGetter.getLandmarks(2);
    expect(landmarks).toStrictEqual([]);
  });

  it('should not return landmarks with null country', async () => {
    const response = {
      data: {
        location: {
          country: null,
        },
        urls: {
          regular: '',
        },
      },
    };
    mockAxios.get.mockResolvedValue(response);

    const landmarks = await landmarkGetter.getLandmarks(2);
    expect(landmarks).toStrictEqual([]);
  });

  it('should not return landmarks with unknown locations', async () => {
    const response = {
      data: {
        location: {
          country: 'test country',
        },
        urls: {
          regular: '',
        },
      },
    };
    mockAxios.get.mockResolvedValue(response);

    const landmarks = await landmarkGetter.getLandmarks(2);

    expect(landmarks).toStrictEqual([]);
  });

  it('should not return landmarks with location Nowhere Land', async () => {
    const response = {
      data: {
        location: {
          country: Country.Nowhere_Land,
        },
        urls: {
          regular: '',
        },
      },
    };
    mockAxios.get.mockResolvedValue(response);

    const landmarks = await landmarkGetter.getLandmarks(2);

    expect(landmarks).toStrictEqual([]);
  });

  it('should return available landmarks and not more', async () => {
    const response = {
      data: {
        location: {
          country: Country.Spain,
        },
        urls: {
          regular: '',
        },
      },
    };
    mockAxios.get.mockResolvedValue(response);

    const landmarks = await landmarkGetter.getLandmarks(150);

    const landmark = {
      imageUrl: '',
      country: Country.Spain,
    };

    const expectedResult = generateDuplicates(2, landmark);
    expect(landmarks).toStrictEqual(expectedResult);
  });

  it('should filter out landmarks without location', async () => {
    const response1 = {
      data: {
        urls: {
          regular: '',
        },
      },
    };
    const response2 = {
      data: {
        location: {
          country: Country.Spain,
        },
        urls: {
          regular: '',
        },
      },
    };
    mockAxios.get
      .mockResolvedValueOnce(response1)
      .mockResolvedValueOnce(response2);

    const landmarks = await landmarkGetter.getLandmarks(2);

    const expectedLandmark = {
      imageUrl: '',
      country: Country.Spain,
    };

    expect(landmarks).toStrictEqual([expectedLandmark]);
  });

  it('should filter out landmarks with unknown location', async () => {
    const response1 = {
      data: {
        location: {
          country: 'test country',
        },
        urls: {
          regular: '',
        },
      },
    };
    const response2 = {
      data: {
        location: {
          country: Country.Spain,
        },
        urls: {
          regular: '',
        },
      },
    };
    mockAxios.get
      .mockResolvedValueOnce(response1)
      .mockResolvedValueOnce(response2);

    const landmarks = await landmarkGetter.getLandmarks(2);
    const expectedLandmark = {
      imageUrl: '',
      country: Country.Spain,
    };

    expect(landmarks).toStrictEqual([expectedLandmark]);
  });
});
