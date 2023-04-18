import OnboardingPage from '../pageobjects/onboarding.page';
import AppHelper from '../utils/app.helper';
import ElementHelper from '../utils/element.helper';
import FrontPagePage from '../pageobjects/frontpage.page';
import SearchPage from '../pageobjects/search.page';
import NavigationHelper from '../utils/navigation.helper';
import DepartureOverviewPage from '../pageobjects/departure.overview.page';
import FavoritePage from '../pageobjects/favorite.page';

describe('Frontpage', () => {
  before(async () => {
    await AppHelper.launchApp();
    await AppHelper.pause(10000, true);
    await OnboardingPage.skipOnboarding('frontpage');
  });
  beforeEach(async () => {
    await NavigationHelper.tapMenu('assistant');
    await NavigationHelper.tapMenu('assistant');
  });

  /**
   * Add a favorite departure from the frontpage
   */
  it('should add favorite departure', async () => {
    const stopPlace = 'Prinsens gate';

    try {
      await ElementHelper.waitForElement('id', 'addFavoriteDeparture');
      expect(await FrontPagePage.noFavoriteInfo.getText()).toHaveTextContaining(
        'You have no favorite departures',
      );

      // Choose stop place
      await FrontPagePage.addFavoriteDeparture.click();
      await ElementHelper.waitForElement('id', 'searchFromButton');
      await FrontPagePage.searchFrom.click();
      await SearchPage.setSearchLocation(stopPlace);

      // Before
      await ElementHelper.waitForElement('id', 'departureItem0');
      expect(await FavoritePage.getFavoriteIcon('semi', 0, 0)).not.toExist();
      expect(await FavoritePage.getFavoriteIcon('no', 0, 1)).toExist();

      // Choose departure
      const linePublicCode = await DepartureOverviewPage.getLinePublicCode();
      const lineName = await DepartureOverviewPage.getLineName();
      const departure = await DepartureOverviewPage.getDeparture();
      await departure.click();

      // Choose only marked departure
      await ElementHelper.waitForElement('id', 'chooseFavoriteBottomSheet');
      await FavoritePage.chooseFavoriteType('single');
      expect(await FavoritePage.getFavoriteIcon('semi', 0, 0)).toExist();
      expect(await FavoritePage.getFavoriteIcon('no', 0, 1)).toExist();
      await FavoritePage.confirm.click();

      // Verify
      await ElementHelper.waitForElement('id', 'favoriteDepartures');
      expect(await FrontPagePage.getFavoriteStopPlace).toContain(stopPlace);
      expect(await FrontPagePage.favoriteDepartureLine).toContain(
        `${linePublicCode} ${lineName}`,
      );
      expect(await FrontPagePage.favoriteDeparture).toExist();
    } catch (errMsg) {
      await AppHelper.screenshot(
        'error_frontpage_should_add_favorite_departure',
      );
      throw errMsg;
    }
  });

  /**
   * Toggle the visibility of a favorite departure from the frontpage
   * Note! Depends on former test
   */
  it('should toggle favorite departure', async () => {
    try {
      await ElementHelper.waitForElement('id', 'favoriteDepartures');
      expect(await FrontPagePage.addFavoriteDeparture).not.toExist();
      expect(await FrontPagePage.selectFavoriteDeparture).toExist();

      // Toggle out
      await FrontPagePage.selectFavoriteDeparture.click();
      await ElementHelper.waitForElement('id', 'selectFavoriteBottomSheet');
      await FavoritePage.toggleVisibility.click();
      await AppHelper.pause(200);
      await FavoritePage.confirm.click();

      // Verify
      await AppHelper.pause(1000);
      expect(await FrontPagePage.favoriteDepartures).not.toExist();
      expect(await FrontPagePage.noFavoriteInfo).not.toExist();

      // Toggle in
      await FrontPagePage.selectFavoriteDeparture.click();
      await ElementHelper.waitForElement('id', 'selectFavoriteBottomSheet');
      await FavoritePage.toggleVisibility.click();
      await AppHelper.pause(200);
      await FavoritePage.confirm.click();

      // Verify
      await AppHelper.pause(1000);
      expect(await FrontPagePage.favoriteDepartures).toExist();
    } catch (errMsg) {
      await AppHelper.screenshot(
        'error_frontpage_should_toggle_favorite_departure',
      );
      throw errMsg;
    }
  });

  /**
   * Remove a favorite departure from the frontpage
   * Note! Depends on former test
   */
  it('should remove favorite departure', async () => {
    try {
      await ElementHelper.waitForElement('id', 'favoriteDepartures');
      expect(await FrontPagePage.favoriteDepartures).toExist();
      expect(await FrontPagePage.noFavoriteInfo).not.toExist();
      await FrontPagePage.selectFavoriteDeparture.click();
      await ElementHelper.waitForElement('id', 'selectFavoriteBottomSheet');

      // Delete
      await FavoritePage.editFavorites.click();
      await ElementHelper.waitForElement('id', 'favoritesList');
      await FavoritePage.deleteFavorite();
      await NavigationHelper.back();

      // Verify
      await ElementHelper.waitForElement('id', 'noFavoriteWidget');
      expect(
        await ElementHelper.isElementExisting('favoriteDepartures', 5),
      ).toEqual(false);
    } catch (errMsg) {
      await AppHelper.screenshot(
        'error_frontpage_should_remove_favorite_departure',
      );
      throw errMsg;
    }
  });

  /**
   * Buy tickets link
   */
  it('should open tickets tab', async () => {
    try {
      await ElementHelper.waitForElement('id', 'dashboardScrollView');
      await ElementHelper.expectText('Travel search');

      await FrontPagePage.buyTickets.click();
      await ElementHelper.waitForElement('id', 'purchaseTab');
      await ElementHelper.expectText('Tickets');
    } catch (errMsg) {
      await AppHelper.screenshot('error_frontpage_should_open_tickets_tab');
      throw errMsg;
    }
  });

  /**
   * Service disruption info
   */
  it('should show link to service disruptions', async () => {
    const linkText = 'atb.no/driftsavvik (opens in browser)';

    try {
      await ElementHelper.waitForElement('id', 'dashboardScrollView');
      await FrontPagePage.serviceDisruptionsInfo.click();

      await ElementHelper.waitForElement('id', 'serviceDisruptionsBottomSheet');
      expect(
        await ElementHelper.isElementExisting(
          'navigateToServiceDisruptions',
          2000,
        ),
      ).toEqual(true);
      expect(
        await FrontPagePage.serviceDisruptionsButton,
      ).toHaveAttributeContaining('text', linkText);
      await NavigationHelper.cancel();
    } catch (errMsg) {
      await AppHelper.screenshot(
        'error_frontpage_should_show_link_to_service_disruptions',
      );
      throw errMsg;
    }
  });
});
