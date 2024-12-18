/**
 * Default parameters or override from ENV
 */
class Config {
  config = {
    LOADING_SCREEN_ENABLED: true,
    LOADING_ERROR_SCREEN_ENABLED: false,
    ONBOARDING_LOGIN_ENABLED: true,
    TRAVEL_SEARCH_DATE: '2025-03-06',
    DEPARTURE_DATE: '2025-03-06',
  };

  loadingScreenEnabled = (): boolean => {
    return <boolean>(
      (process.env.LOADING_SCREEN_ENABLED || this.config.LOADING_SCREEN_ENABLED)
    );
  };

  loadingErrorScreenEnabled = (): boolean => {
    return <boolean>(
      (process.env.LOADING_ERROR_SCREEN_ENABLED ||
        this.config.LOADING_ERROR_SCREEN_ENABLED)
    );
  };

  onboardingLoginEnabled = (): boolean => {
    return <boolean>(
      (process.env.ONBOARDING_LOGIN_ENABLED ||
        this.config.ONBOARDING_LOGIN_ENABLED)
    );
  };

  travelSearchDate = (): string => {
    return <string>(
      (process.env.TRAVEL_SEARCH_DATE || this.config.TRAVEL_SEARCH_DATE)
    );
  };

  departureDate = (): string => {
    return <string>(process.env.DEPARTURE_DATE || this.config.DEPARTURE_DATE);
  };
}

export default new Config();
