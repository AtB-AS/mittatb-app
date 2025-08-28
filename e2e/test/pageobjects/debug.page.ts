class DebugPage {
  /**
   * Check if the mobile token id exists
   */
  get hasMobileTokenId() {
    const reqId = `//*[@resource-id="tokenId"]`;
    return $(reqId).isExisting();
  }

  /**
   * Open the chosen section
   * @param section section to open
   */
  async open(section: string) {
    const reqId = `//*[@resource-id="${section}Debug"]`;
    await $(reqId).click();
  }

  /**
   * Get the mobile token status
   */
  async getMobileTokenStatus() {
    const reqId = `//*[@resource-id="tokenStatus"]`;
    return (await $(reqId).getText()).split(': ')[1];
  }
}

export default new DebugPage();
