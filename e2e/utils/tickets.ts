import {by} from 'detox';
import {tapById} from './interactionHelpers';
import {getTextOfElementId, idExists} from './commonHelpers';
import {expectBoolean} from './jestAssertions';
import {expectToBeVisibleByText} from './expectHelpers';
import {Traveller} from './Traveller';

// Check if ticketing has to be accepted
export const ensureTicketingIsAccepted = async () => {
  const haveToAcceptTickets = await idExists(by.id('acceptTicketingButton'));
  if (haveToAcceptTickets) {
    await tapById('acceptTicketingButton');
  }
};

// Check if bought ticket has appeared in the ticket tab
export const newTicketExists = async (zoneInfo: string = '') => {
  /*
    0. Check if single ticket is processing
    1. Check if single ticket is captured
   */
  let procExists = await idExists(by.id('ticketReservation'), 10000);
  let ticketExists = false;

  if (!procExists) {
    ticketExists = await idExists(
      by.id('ticket0Product').and(by.text('Single ticket bus/tram')),
      5000,
    );
  } else {
    ticketExists = await idExists(
      by.id('ticket0Product').and(by.text('Single ticket bus/tram')),
      20000,
    );
  }
  expectBoolean(ticketExists, true, 'newTicketExists');

  // Check correct zone
  if (zoneInfo) {
    let zoneIsCorrect = await idExists(
      by.id('ticket0Zones').and(by.text(zoneInfo)),
      10000,
    );
    expectBoolean(zoneIsCorrect, true, 'newTicketZoneIsCorrect');
  }
};

// Helper for handling keyboard-popup
const tapZone = async (zoneId: string) => {
  await tapById(zoneId);
  const zoneIdExists = await idExists(by.id(zoneId));
  if (zoneIdExists) {
    await tapById(zoneId);
  }
};

// Set one zone
export const setZone = async (direction: 'To' | 'From', zone: string) => {
  await tapById('selectZonesButton');
  await tapById(`search${direction}Button`);
  await tapZone(`tariffZone${zone}Button`);
  await tapById('saveZonesButton');
};

// Set zones
export const setZones = async (fromZone: string, toZone: string) => {
  await tapById('selectZonesButton');
  await tapById('searchFromButton');
  await tapZone(`tariffZone${fromZone}Button`);
  await tapById('searchToButton');
  await tapZone(`tariffZone${toZone}Button`);
  await tapById('saveZonesButton');
};

// Buy single ticket (only within a single zone, and for adult/senior/child)
export const buySingleTicket = async (travellers: Traveller, zone: string) => {
  await tapById('singleTicket');

  // Set zones
  await setZones(zone, zone);
  // Set travellers
  await tapById('selectTravellersButton');
  if (!travellers.adult) {
    // Default 1 Adult
    await tapById('counterInput0_rem');
  }
  if (travellers.adultCount != undefined && travellers.adultCount != 1) {
    // Default 1 Adult
    for (let i = 1; i < travellers.adultCount; i++) {
      await tapById('counterInput0_add');
    }
  }
  if (travellers.senior) {
    await tapById('counterInput1_add');
  }
  if (travellers.child) {
    await tapById('counterInput2_add');
  }
  await tapById('saveTravellersButton');

  // Pay with stored payment card
  await tapById('goToPaymentButton');
  await tapById('choosePaymentOptionButton');
  await tapById('recurringPayment0');
  await tapById('confirmButton');

  // Check if ticket exists
  await newTicketExists(`Travel in 1 zone (${zone})`);
};

// Buy single ticket (only within a single zone, and for adult/senior/child)
export const buyRecentTicket = async (index: Number = 0) => {
  await tapById(`recent${index}BuyButton`);

  // Pay with stored payment card
  await tapById('choosePaymentOptionButton');
  await tapById('recurringPayment0');
  await tapById('confirmButton');

  // Check if ticket exists
  await newTicketExists();
};

// Verify existence in buy summary
export const verifyTravellersAndZoneInSummary = async (
  travellers: Traveller,
  zone: string,
) => {
  // Travellers
  if (travellers.adult) {
    await expectToBeVisibleByText('1 Adult');
  }
  if (travellers.senior) {
    await expectToBeVisibleByText('1 Senior');
  }
  if (travellers.child) {
    await expectToBeVisibleByText('1 Child');
  }

  // Zone
  await expectToBeVisibleByText(`Valid in zone ${zone}`);
};

// Concats traveller and zone information for a recent ticket
export const getTravelInfoForRecentTicket = async (recentTicketId: string) => {
  //Traveller info = Traveller + Zone = (1 or 2 or 1 + other category) + zone
  let travelInfo = '';

  if (await idExists(by.id(`${recentTicketId}Travellers0`))) {
    travelInfo += await getTextOfElementId(`${recentTicketId}Travellers0`);
  }
  if (await idExists(by.id(`${recentTicketId}Travellers1`))) {
    travelInfo += await getTextOfElementId(`${recentTicketId}Travellers1`);
  }
  if (await idExists(by.id(`${recentTicketId}TravellersOthers`))) {
    travelInfo += await getTextOfElementId(`${recentTicketId}TravellersOthers`);
  }
  if (await idExists(by.id(`${recentTicketId}Zone`))) {
    travelInfo += await getTextOfElementId(`${recentTicketId}Zone`);
  }
  if (await idExists(by.id(`${recentTicketId}Zones`))) {
    travelInfo += await getTextOfElementId(`${recentTicketId}Zones`);
  }

  return travelInfo;
};
