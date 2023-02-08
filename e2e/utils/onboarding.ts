import {by, element} from 'detox';
import {goToTab, idExists} from './commonHelpers';
import {tapById, tapByText, waitToExistByElem} from './interactionHelpers';
import {toggleLanguage} from './myprofile';
import {conf} from './configValues';
import {expectVisible} from './expectHelpers';

// Step through the onboarding
export async function skipOnboarding() {
  const nextExists = await idExists(by.id('nextButton'));
  if (nextExists) {
    await element(by.id('nextButton')).atIndex(0).tap();
    await element(by.id('nextButton')).atIndex(0).tap();
    await waitToExistByElem(
      element(by.id('acceptRestrictionsButton')),
      conf.elemTO,
    );
    await element(by.id('acceptRestrictionsButton')).tap();
    await checkLanguage();
    await expectVisible(element(by.text('Travel search')));
  }
}

const checkLanguage = async () => {
  const correctTitle = await idExists(by.text('Travel search'));
  if (!correctTitle) {
    await goToTab('profile');
    await tapById('languageButton');
    await toggleLanguage(false);
    await tapByText('English');
    await goToTab('profile');
    await goToTab('assistant');
  }
};
