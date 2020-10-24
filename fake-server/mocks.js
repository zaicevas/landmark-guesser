const emptyUrls = {
  raw: '',
  full: '',
  regular: '',
  small: '',
  thumb: '',
};

const imagePage = {
  results: [
    {
      id: '0',
      urls: {
        ...emptyUrls,
      },
    },
  ],
};

const imageInfo = {
  location: {
    country: 'France',
  },
  urls: {
    ...emptyUrls,
  },
};

module.exports = {
  imagePage,
  imageInfo,
};
