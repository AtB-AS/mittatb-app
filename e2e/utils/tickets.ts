import {by} from 'detox';
import {tapById} from './interactionHelpers';
import {idExists} from './commonHelpers';
import {expectBoolean} from './jestAssertions';

// Check if ticketing has to be accepted
export const ensureTicketingIsAccepted = async () => {
  const haveToAcceptTickets = await idExists(by.id('acceptTicketingButton'));
  if (haveToAcceptTickets) {
    await tapById('acceptTicketingButton');
  }
};

// Check if bought ticket has appeared in the ticket tab
export const newTicketExists = async () => {
  /*
    1. Check if single ticket already is captured
    2. Check if single ticket still is processing
    3. Catch any changes during 1) and 2)
   */
  let ticketExists = await idExists(
    by.id('ticket0Product').and(by.text('Single ticket bus/tram')),
    20000,
  );
  if (!ticketExists) {
    ticketExists = await idExists(by.id('ticketReservation'), 10000);
    if (!ticketExists) {
      ticketExists = await idExists(
        by.id('ticket0Product').and(by.text('Single ticket bus/tram')),
        10000,
      );
    }
  }
  expectBoolean(ticketExists, true, 'newTicketExists');
};
