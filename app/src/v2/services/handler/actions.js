const API_ERROR = 'API_ERROR';

const apiError = (error) => ({
  type: API_ERROR,
  error,
});

export default {
  constants: {
    API_ERROR,
  },
  creators: {
    apiError,
  },
};
