import {TicketingTexts, useTranslation} from '@atb/translations';
import {TicketTilted} from '@atb/assets/svg/color/images';
import {EmptyState} from '@atb/components/empty-state';

export const NoActiveTickets = () => {
  const {t} = useTranslation();

  return (
    <EmptyState
      title={t(
        TicketingTexts.activeFareProductsAndReservationsTab.noActiveItemsTitle,
      )}
      details={t(
        TicketingTexts.activeFareProductsAndReservationsTab
          .noActiveItemsDetails,
      )}
      illustrationComponent={<TicketTilted height={84} />}
    />
  );
};
