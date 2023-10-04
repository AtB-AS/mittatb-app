import {useTheme} from '@atb/theme';
import {TicketingTexts, useTranslation} from '@atb/translations';
import {TicketTilted} from '@atb/assets/svg/color/images';
import {EmptyState} from '@atb/components/empty-state';

export const NoActiveTickets = () => {
  const {theme} = useTheme();
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
      illustrationComponent={
        <TicketTilted height={theme.icon.size.large * 4} />
      }
    />
  );
};
