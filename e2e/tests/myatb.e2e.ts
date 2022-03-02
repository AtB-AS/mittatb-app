import {device, by, element, expect} from 'detox';
import {findTextViewElement, goToPage, scrollToElement, scrollToElementText} from "../utils/common";
import {skipOnboarding} from "../utils/onboarding";
import {addFavouriteLocation, deleteFavouriteLocation, editFavouriteLocation, sortLabelExists} from "../utils/myatb";
import setLocation from "../utils";

describe('My AtB', () => {
    beforeAll(async () => {
        await device.launchApp({
            permissions: {
                location: 'inuse',
            },
            languageAndLocale: {
                language: 'en',
                locale: 'US',
            },
        });
        await setLocation(62.4305, 9.3951);
        await skipOnboarding();

        await goToPage('My AtB')
    });

    beforeEach(async () => {
        //await device.reloadReactNative();
        await goToPage('My AtB')
        await element(by.type('RCTCustomScrollView')).scrollTo('top')
    });

    // TODO How to check change of appearance?

    // Validates all the option in 'My AtB'
    it('should show correct options in My AtB', async () => {
        // Scrolls to the bottom first in order to ensure that all sub menus are visible when scrolling up to a menu
        await element(by.type('RCTCustomScrollView')).scrollTo('bottom')
        await expect(element(by.text('Ticketing'))).toBeVisible();
        await expect(element(by.text('Payment'))).toBeVisible();
        await expect(element(by.text('Terms'))).toBeVisible();
        await expect(element(by.text('Ticket inspection'))).toBeVisible();

        await scrollToElementText({searchTerm: 'Privacy', direction: 'up'})
        await expect(element(by.text('Privacy statement'))).toBeVisible();
        await expect(element(by.text('Clear search history'))).toBeVisible();

        await scrollToElementText({searchTerm: 'Favourites', direction: 'up'})
        await expect(element(by.text('Locations'))).toBeVisible();
        await expect(element(by.text('Departures').withAncestor(by.label('Favourites Locations Departures')))).toBeVisible();

        await scrollToElementText({searchTerm: 'BETA', direction: 'up'})
        await expect(element(by.text('Try the new departure view'))).toBeVisible();
        await expect(element(by.text('Try the new travel search engine'))).toBeVisible();
        await expect(element(by.text('Invitation code'))).toBeVisible();

        await scrollToElementText({searchTerm: 'Settings', direction: 'up'})
        await expect(element(by.text('Default traveller'))).toBeVisible();
        await expect(element(by.text('Appearance'))).toBeVisible();
        await expect(element(by.text('Start page'))).toBeVisible();
        await expect(element(by.text('Language'))).toBeVisible();

        await scrollToElementText({searchTerm: 'My account', direction: 'up'})
        await expect(element(by.text('Customer number'))).toBeVisible();
        await expect(element(by.text('Sign in'))).toBeVisible();
        await expect(element(by.text('Expired tickets'))).toBeVisible();
    })

    // Validates language change
    it('Settings: should change language', async () => {
        await scrollToElementText({searchTerm: 'Settings', direction: 'up'})
        await expect(element(by.text('Default traveller'))).toBeVisible();
        await expect(element(by.text('Appearance'))).toBeVisible();
        await expect(element(by.text('Start page'))).toBeVisible();
        await expect(element(by.text('Language'))).toBeVisible();

        await element(by.text('Language')).tap()
        await expect(element(by.text('Language'))).toBeVisible();
        await expect(element(by.text('Språk'))).not.toExist();
        await expect(element(by.text('Use my phone settings'))).toBeVisible();
        await expect(element(by.text('Norsk bokmål'))).not.toBeVisible();
        await expect(element(by.text('English'))).not.toBeVisible();

        // Manually choose language
        await element(by.type('RCTSwitch').and(by.label('Use my phone settings'))).tap()
        await expect(element(by.text('Norsk bokmål'))).toBeVisible();
        await expect(element(by.text('English'))).toBeVisible();

        await element(by.text('Norsk bokmål')).tap()
        await expect(element(by.text('Språk'))).toBeVisible()

        // Validate
        await element(by.text('Tilbake')).tap()
        await expect(element(by.text('Standard reisende'))).toBeVisible();
        await expect(element(by.text('Utseende'))).toBeVisible();
        await expect(element(by.text('Startside'))).toBeVisible();
        await expect(element(by.text('Språk'))).toBeVisible();
        //TODO Should we handle a possible failure here regarding that the App then will be in Norwegian
        // for the remaining test cases?

        await element(by.text('Språk')).tap()
        await expect(element(by.text('Language'))).not.toExist();
        await expect(element(by.text('Språk'))).toBeVisible();
        await expect(element(by.text('Bruk telefoninnstillingene mine'))).toBeVisible();
        await expect(element(by.text('Norsk bokmål'))).toBeVisible();
        await expect(element(by.text('English'))).toBeVisible();

        await element(by.text('English')).tap()
        await expect(element(by.text('Language'))).toBeVisible();
        await expect(element(by.text('Språk'))).not.toExist();
        await expect(element(by.text('Use my phone settings'))).toBeVisible();
        await expect(element(by.text('Norsk bokmål'))).toBeVisible();
        await expect(element(by.text('English'))).toBeVisible();

        // Use phone settings
        await element(by.type('RCTSwitch').and(by.label('Use my phone settings'))).tap()
        await expect(element(by.text('Language'))).toBeVisible();
        await expect(element(by.text('Språk'))).not.toExist();
        await expect(element(by.text('Use my phone settings'))).toBeVisible();
        await expect(element(by.text('Norsk bokmål'))).not.toBeVisible();
        await expect(element(by.text('English'))).not.toBeVisible();
    })

    it('Settings: should add, edit, delete and sort favourite locations', async () => {
        const location = await findTextViewElement('Locations')
        await scrollToElement({element: location, direction: 'down'})
        await location.tap()
        await expect(element(by.text('Favourite locations'))).toBeVisible();

        // Add
        await expect(element(by.text('LGT'))).not.toExist();
        await addFavouriteLocation('Loddgårdstrøa', 'LGT')
        await expect(element(by.text('LGT'))).toBeVisible();

        // Edit
        await expect(element(by.text('LGTedit'))).not.toExist();
        await editFavouriteLocation('LGT', 'LGTedit')
        await expect(element(by.text('LGT'))).not.toExist();
        await expect(element(by.text('LGTedit'))).toBeVisible()

        // Delete
        //TODO to get number of favourites, we need id's on the elements
        await deleteFavouriteLocation('LGTedit')
        await expect(element(by.text('LGTedit'))).not.toExist();

        // Add 2 locations
        await addFavouriteLocation('Loddgårdstrøa', 'LGT1')
        await addFavouriteLocation('Loddgårdstrøa', 'LGT2')
        await expect(element(by.text('LGT1'))).toBeVisible();
        await expect(element(by.text('LGT2'))).toBeVisible();

        // Sort and validate
        await element(by.text('Re-arrange favourites')).tap()
        await expect(element(by.text('Reorder favourites'))).toBeVisible();

        /*
        // TODO [1] Remove this if the ugly labels below suits the purpose
        // To re-order: can use these methods to find the labels, but they are slooow
        // Instead use the fixed labels below
        const label1 = await sortLabelExists('LGT1', 'ned')
        const label2 = await sortLabelExists('LGT2', 'opp')

        await element(by.type('RCTView').and(by.label(label1))).tap()

        const label3 = await sortLabelExists('LGT2', 'ned')
        const label4 = await sortLabelExists('LGT1', 'opp')
         */

        //TODO A bit ugly with these labels
        const labelDown = "Flytt  LGT1 ned \n"
        const labelUp = "Flytt  LGT1 opp \n"
        await expect(element(by.type('RCTView').and(by.label(labelDown)))).toExist()
        await expect(element(by.type('RCTView').and(by.label(labelUp)))).not.toExist()
        await element(by.type('RCTView').and(by.label(labelDown))).tap()
        await expect(element(by.type('RCTView').and(by.label(labelDown)))).not.toExist()
        await expect(element(by.type('RCTView').and(by.label(labelUp)))).toExist()
        await element(by.text('Save')).tap()

        // Validate
        await element(by.text('Re-arrange favourites')).tap()
        await expect(element(by.type('RCTView').and(by.label(labelDown)))).not.toExist()
        await expect(element(by.type('RCTView').and(by.label(labelUp)))).toExist()
        await element(by.text('Cancel')).tap()

    })

});