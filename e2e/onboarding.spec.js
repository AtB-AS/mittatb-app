describe('Onboarding', () => {
  beforeAll(async () => {
    await device.launchApp({permissions: {location: 'inuse'}});
  }, 300000);

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should show error on when trying to move next without selecting location', async () => {
    await expect(element(by.text('Hvor bor du?'))).toBeVisible();
    await element(by.id('homeFormButton')).tap();
    await expect(
      element(
        by.text('Vennligst søk opp og velg en gyldig adresse fra listen.'),
      ),
    ).toBeVisible();
  });

  it('should be able to complete onboarding', async () => {
    await expect(element(by.text('Hvor bor du?'))).toBeVisible();
    await element(by.id('homeFormInput')).tap();
    await element(by.id('homeFormInput')).typeText('Tonstadbrinken');
    await element(by.id('suggestionText').and(by.text('Tonstadbrinken'))).tap();
    await element(by.id('homeFormButton')).tap();
    await expect(element(by.text('Hvor jobber du?'))).toBeVisible();
    await element(by.id('workFormInput')).tap();
    await element(by.id('workFormInput')).typeText('Prinsens gate 39');
    await element(
      by.id('suggestionText').and(by.text('Prinsens gate 39')),
    ).tap();
    await element(by.id('workFormButton')).tap();
  });
});
