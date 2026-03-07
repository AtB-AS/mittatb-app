import OnboardingPage from '../pageobjects/onboarding.page.ts';
import AppHelper from '../utils/app.helper.ts';
import ElementHelper from '../utils/element.helper.ts';
import FrontPagePage from '../pageobjects/frontpage.page.ts';
import SearchPage from '../pageobjects/search.page.ts';
import NavigationHelper from '../utils/navigation.helper.ts';
import FavoritePage from '../pageobjects/favorite.page.ts';

describe('Frontpage', () => {
  before(async () => {
    //await AppHelper.launchApp();
    await AppHelper.waitOnLoadingScreen();
    await OnboardingPage.skipOnboarding('frontpage');
    await AppHelper.pause(5000, true);
  });
  beforeEach(async () => {
    await NavigationHelper.tapMenu('assistant');
    await NavigationHelper.tapMenu('assistant');
  });

  /**
   * Remove dismissible messages - mainly to avoid scrolling on the page
   *  - Global messages
   *  - Announcements
   */
  it('should remove messages', async () => {
    try {
      await AppHelper.removeGlobalMessages();
      await AppHelper.pause(1000);
      await FrontPagePage.removeAnnouncements();
    } catch (errMsg) {
      await AppHelper.screenshot('error_frontpage_should_remove_messages');
      throw errMsg;
    }
  });

  /**
   * Add a favorite departure from the frontpage
   */
  it('should add favorite departure', async () => {
    const stopPlace = 'Prinsens gate';

    try {
      await ElementHelper.waitForElement('id', 'addFavoriteDeparture');
      //expect(await FrontPagePage.noFavoriteInfo.getText()).toHaveTextContaining(..)
      //expect(await FrontPagePage.noFavoriteInfo).toHaveText(...)
      expect(await FrontPagePage.noFavoriteInfo).toExist();

      // Choose stop place
      await FrontPagePage.addFavoriteDeparture.click();
      await ElementHelper.waitForElement(
        'id',
        'noAccessToLocationEmptyStateView',
      );
      await FrontPagePage.searchFrom.click();
      await SearchPage.setSearchLocation(stopPlace);

      // Before
      await ElementHelper.waitForElement('id', 'lineItem');

      // Choose departure
      const linePublicCode = await FavoritePage.getLinePublicCode();
      const lineName = await FavoritePage.getLineName();
      await FavoritePage.chooseLine();

      // Choose only marked departure
      await ElementHelper.waitForElement(
        'id',
        'chooseFavoriteBottomSheetHeader',
      );
      await FavoritePage.chooseFavoriteType('single');
      await AppHelper.pause(1000);

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
      await ElementHelper.waitForElement(
        'id',
        'selectFavoriteBottomSheetHeader',
      );
      await FavoritePage.toggleVisibility.click();
      await AppHelper.pause(200);
      await NavigationHelper.closeBottomSheet();

      // Verify
      await AppHelper.pause(1000);
      expect(await FrontPagePage.favoriteDepartures).not.toExist();
      expect(await FrontPagePage.noFavoriteInfo).not.toExist();

      // Toggle in
      await FrontPagePage.selectFavoriteDeparture.click();
      await ElementHelper.waitForElement(
        'id',
        'selectFavoriteBottomSheetHeader',
      );
      await FavoritePage.toggleVisibility.click();
      await AppHelper.pause(200);
      await NavigationHelper.closeBottomSheet();

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
      await ElementHelper.waitForElement(
        'id',
        'selectFavoriteBottomSheetHeader',
      );

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
      await ElementHelper.expectText('Travel');

      await FrontPagePage.buyTickets.click();
      await ElementHelper.waitForElement('id', 'purchaseTab');
      await ElementHelper.expectText('Tickets');
    } catch (errMsg) {
      await AppHelper.screenshot('error_frontpage_should_open_tickets_tab');
      throw errMsg;
    }
  });
});
