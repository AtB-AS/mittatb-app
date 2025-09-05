class TicketFrontPagePage {
  /**
   * Check if there exists a ticket
   */
  async hasTicket() {
    const reqId = `//*[@resource-id="fareContract0"]`;
    return await $(reqId).isExisting();
  }

  /**
   * Get the product name for the ticket
   * @param index which ticket to check (default: 0)
   */
  async ticketProductName(index: number = 0) {
    const fcId = `//*[@resource-id="fareContract${index}"]`;
    const nameId = `//*[@resource-id="productName"]`;
    return await $(fcId).$(nameId).getText();
  }

  /**
   * Open the ticket details
   * @param index which ticket to check (default: 0)
   */
  async openTicketDetails(index: number = 0) {
    const fcId = `//*[@resource-id="fareContract${index}"]`;
    await $(fcId).click();
  }

  /**
   * Check if the ticket is inspectable
   * @param index which ticket to check (default: 0)
   */
  async ticketIsInspectable(index: number = 0) {
    const fcId = `//*[@resource-id="fareContract${index}"]`;
    const inspId = `//*[@resource-id="inspectableIcon"]`;
    return await $(fcId).$(inspId).isExisting();
  }

  /**
   * Check if the ticket is NOT inspectable
   * @param index which ticket to check (default: 0)
   */
  async ticketIsNotInspectable(index: number = 0) {
    const fcId = `//*[@resource-id="fareContract${index}"]`;
    const inspId = `//*[@resource-id="notInspectableIcon"]`;
    return await $(fcId).$(inspId).isExisting();
  }
}

export default new TicketFrontPagePage();
