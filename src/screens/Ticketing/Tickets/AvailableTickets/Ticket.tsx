import {
  Mode,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {TouchableOpacity, View} from 'react-native';
import TransportationIcon from '@atb/components/transportation-icon';
import ThemeText from '@atb/components/text';
import React from 'react';
import {StyleSheet} from '@atb/theme';
import ThemedTicketIllustration, {
  TicketIllustration,
} from '@atb/components/ticket-illustration';
import {TicketsTexts, useTranslation} from '@atb/translations';

export type TransportationModeIconProperties = {
  mode: Mode;
  subMode?: TransportSubmode;
};

const Ticket = ({
  title,
  description,
  transportationModeIcons,
  transportationModeTexts,
  ticketIllustration,
  accented = false,
  onPress,
}: {
  title: string;
  description: string;
  transportationModeIcons: TransportationModeIconProperties[];
  transportationModeTexts: string;
  ticketIllustration: TicketIllustration;
  accented?: boolean;
  onPress: () => void;
}) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const ticketTheme = accented ? styles.ticket_accented : styles.ticket_normal;

  // @TODO: Update to support new design system
  // const textColor = accented ? 'primary_2' : 'primary';
  const textColor = 'primary';
  const accessibilityLabel = [title, transportationModeTexts, description].join(
    '. ',
  );

  return (
    <View style={[styles.ticket, ticketTheme]}>
      <TouchableOpacity
        onPress={onPress}
        accessible={true}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={t(TicketsTexts.availableTickets.navigateToBuy)}
      >
        <View style={{flexShrink: 1}}>
          <View style={styles.ticketIconContainer}>
            {transportationModeIcons.map((icon) => {
              return (
                <TransportationIcon
                  size={'small'}
                  mode={icon.mode}
                  subMode={icon.subMode}
                  key={icon.mode + icon.subMode}
                />
              );
            })}
            <ThemeText type="label__uppercase" style={styles.label}>
              {transportationModeTexts}
            </ThemeText>
          </View>
          <ThemeText
            type="body__secondary--bold"
            style={styles.ticket_name}
            accessibilityLabel={title}
          >
            {title}
          </ThemeText>
          <ThemeText
            type="body__tertiary"
            style={styles.description}
            color={'secondary'}
          >
            {description}
          </ThemeText>
        </View>
        <View style={styles.ticketIllustrationContainer}>
          <View style={styles.ticketIllustration}>
            <ThemedTicketIllustration name={ticketIllustration} />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  ticket: {
    width: '100%',
    flexShrink: 1,
    alignSelf: 'stretch',
    marginRight: theme.spacings.medium,
    padding: theme.spacings.xLarge,
    borderRadius: theme.border.radius.regular,
  },
  ticket_normal: {
    backgroundColor: theme.static.background.background_0.background,
  },
  ticket_accented: {
    backgroundColor: theme.static.background.background_accent_3.background,
    textColor: theme.static.background.background_accent_3.text,
  },
  ticketIconContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {marginLeft: theme.spacings.xSmall},
  ticketIllustrationContainer: {
    flexGrow: 1,
    flexDirection: 'row',
    marginTop: theme.spacings.small,
  },
  ticketIllustration: {
    alignSelf: 'flex-end',
  },
  ticket_name: {
    marginBottom: theme.spacings.small,
    marginTop: theme.spacings.medium,
  },
  description: {marginBottom: theme.spacings.small},
}));

export default Ticket;
