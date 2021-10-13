import { getToken } from '../../native';
export default async function loadingHandler() {
  try {
    const token = await getToken();

    if (!token) {
      return {
        state: 'Initiating'
      };
    } else {
      const tokenNeedsRenewal = token.tokenValidityStart < getTime24HoursAgo();
      return tokenNeedsRenewal ? {
        state: 'Renewing'
      } : {
        state: 'Validating'
      };
    }
  } catch (err) {
    return {
      state: 'Loading',
      error: {
        type: 'Unknown',
        message: 'Error loading native token status',
        err
      }
    };
  }
}

const getTime24HoursAgo = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.getTime();
};
//# sourceMappingURL=LoadingHandler.js.map