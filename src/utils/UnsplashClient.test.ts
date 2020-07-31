import {fetchImagePage} from './UnsplashClient';
import axios from 'axios';
import _ from 'lodash';

jest.mock('axios');
const mockAxios = axios as jest.Mocked<typeof axios>;

describe('fetchImageIds should return fetched ids', () => {
  it('should return all ids', () => {
    const images = [
      {
        id: 'id1',
      },
      {
        id: 'id2',
      },
    ];
    const response = {data: {results: images}};
    mockAxios.get.mockResolvedValue(response);

    expect(fetchImagePage(1, 2)).resolves.toStrictEqual(['id1', 'id2']);
  });
});
