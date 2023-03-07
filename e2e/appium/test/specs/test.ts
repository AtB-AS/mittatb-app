const {remote} = require('webdriverio');

async function runTest() {
  const driver = await remote();
  try {
    await driver.pause(5000);
    //const item = await driver.element.findElement('id', 'nextButton');
    //const item = await $('#nextButton')

    //const itemRef = await driver.findElement('id', 'nextButton');
    //const item = await $(itemRef)

    //await driver.$('~nextButton').waitForDisplayed({ timeout: 5000});
    //const element22 = driver.$("~nextButton");
    //await element22.click()

    //if(driver.findElement(By.xpath(“YOUR XPATH”)).isDisplayed() )

    //driver.findElement (By.xpath ("//*[contains(@text, ‘apple’)]"));
    //driver.findElement (By.xpath ("//*[contains(@text, ‘apple’) or contains(@text, ‘orange’)]"))

    //`//*[@view-tag="${id}"]`
    await driver
      .$('//*[@resource-id="nextButton"]')
      .waitForDisplayed({timeout: 5000, interval: 1000});
    let button = await driver.$('//*[@resource-id="nextButton"]');
    await button.click();
    await driver
      .$('//*[@resource-id="nextButton"]')
      .waitForDisplayed({timeout: 5000, interval: 1000});
    button = await driver.$('//*[@resource-id="nextButton"]');
    await button.click();
    await driver
      .$('//*[@resource-id="acceptRestrictionsButton"]')
      .waitForDisplayed({timeout: 5000});
    button = await driver.$('//*[@resource-id="acceptRestrictionsButton"]');
    await button.click();

    await driver
      .$(
        '//*[@resource-id="com.android.permissioncontroller:id/permission_deny_button"]',
      )
      .waitForDisplayed({timeout: 5000});
    button = await driver.$(
      '//*[@resource-id="com.android.permissioncontroller:id/permission_deny_button"]',
    );
    await button.click();

    //TODO Så ut til å virke på 7.30.0 og ikke på 8.3.11
    await driver
      .$('//*[@text="Travel search"]')
      .waitForDisplayed({timeout: 5000});
    //const title = await driver.findElement('xpath', '//*[contains(@text, "Travel search")]')
    const title = await driver.$('//*[@text="Travel search"]');
    //await expect(title).toHaveTextContaining('Travel search')

    //com.android.permissioncontroller:id/permission_deny_button
  } finally {
    await driver.pause(1000);
    await driver.deleteSession();
  }
}

runTest().catch(console.error);
