import {ConfirmationTexts} from '@atb/translations/screens/subscreens/PurchaseConfirmation';
import {APP_SCHEME} from '@env';

/**
 * This const serves to save the route after the confirmation screen is dismissed
 *
 * example route to Ticket history - sent to others.
 *
 * sent_ticket: {
 *   screen: 'Root_TabNavigatorStack',
 *   params: {
 *     screen: 'TabNav_TicketingStack',
 *     params: {
 *       screen: 'Ticketing_TicketHistoryScreen',
 *       params: {mode: 'sent'},
 *     },
 *   },
 * },
 *
 * then we can send 'sent_ticket' as the nextScreen param for this screen
 *
 */
export const ConfirmationScreenResolver = {
  myTickets: {
    screen: 'Root_TabNavigatorStack',
    params: {
      screen: 'TabNav_TicketingStack',
      params: {
        screen: 'Ticketing_RootScreen',
        params: {
          screen: 'TicketTabNav_ActiveFareProductsTabScreen',
        },
      },
    },
  },
} as const;

/**
 * Function for building redirection URL for the confirmation page
 *
 * @param nextScreen next screen constant @see ConfirmationScreenResolver
 * @param message message to display @see ConfirmationTexts
 * @param delay how long the confirmation screen should be shown, in millisecond
 * @returns redirection URL that will show the confirmation screen with the parameters set.
 */
export function redirectUrlBuilder(
  nextScreen: keyof typeof ConfirmationScreenResolver,
  message: keyof typeof ConfirmationTexts,
  delay: number,
) {
  return `${APP_SCHEME}://confirmation/${nextScreen}/${message}/${delay}`;
}
