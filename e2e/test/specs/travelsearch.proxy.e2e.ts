import AppHelper from '../utils/app.helper.ts';
import NavigationHelper from '../utils/navigation.helper.js';
import ElementHelper from '../utils/element.helper.js';
import FrontPagePage from '../pageobjects/frontpage.page.js';
import SearchPage from '../pageobjects/search.page.js';
import TravelsearchOverviewPage from '../pageobjects/travelsearch.overview.page.js';
import OnboardingPage from '../pageobjects/onboarding.page.js';

/*
  START WIREMOCK
  docker run -it --rm -p 8080:8080 --name wiremock \
    -e "JAVA_OPTS=--add-opens java.base/sun.security.x509=ALL-UNNAMED" \
    -v "$PWD/wiremock/mappings:/home/wiremock/mappings" \
    -v "$PWD/wiremock/__files:/home/wiremock/__files" \
    wiremock/wiremock:3.13.2 \
    --enable-browser-proxying
 */

const WIREMOCK_URL = process.env.UPSTREAM_PROXY ?? 'http://localhost:8080';
const WIREMOCK_TARGET = 'https://atb-staging.api.mittatb.no';
const record = false;

describe('Travel search with external proxy', () => {
  before(async () => {
    if (record) {
      await fetch(`${WIREMOCK_URL}/__admin/recordings/start`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          targetBaseUrl: WIREMOCK_TARGET,
          persist: true,
          filters: {
            headers: {
              Host: {equalTo: 'atb-staging.api.mittatb.no'},
            },
          },
        }),
      });
    }

    await AppHelper.waitOnLoadingScreen();
    await OnboardingPage.skipOnboarding('travelsearch_proxy');
    await AppHelper.pause(2000, true);
  });

  after(async () => {
    if (record) {
      await fetch(`${WIREMOCK_URL}/__admin/recordings/stop`, {method: 'POST'});
    }
  });

  it('should do a travel search', async () => {
    const departure = 'Prinsens gate';
    const arrival = 'Melhus skysstasjon';

    try {
      await NavigationHelper.tapMenu('assistant');
      await ElementHelper.waitForElement('id', 'searchFromButton');
      await FrontPagePage.searchFrom.click();
      await SearchPage.setSearchLocation(departure);

      await ElementHelper.waitForElement('id', 'searchToButton');
      await FrontPagePage.searchTo.click();
      await SearchPage.setSearchLocation(arrival);

      await TravelsearchOverviewPage.waitForTravelSearchResults();

      // Details
      await TravelsearchOverviewPage.openSearchResult();
      await NavigationHelper.back();
    } catch (errMsg) {
      await AppHelper.screenshot('error_proxy_travel_search');
      throw errMsg;
    }
  });

});
