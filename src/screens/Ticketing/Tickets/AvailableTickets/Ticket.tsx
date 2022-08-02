import {
  Mode,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {TouchableOpacity, View} from 'react-native';
import TransportationIcon from '@atb/components/transportation-icon';
import ThemeText from '@atb/components/text';
import React from 'react';
import {StyleSheet, useTheme} from '@atb/theme';
import ThemedTicketIllustration, {
  TicketIllustration,
} from '@atb/components/ticket-illustration';
import {TicketsTexts, useTranslation} from '@atb/translations';
import {getStaticColor, StaticColor} from '@atb/theme/colors';

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
  testID,
}: {
  title: string;
  description: string;
  transportationModeIcons: TransportationModeIconProperties[];
  transportationModeTexts: string;
  ticketIllustration: TicketIllustration;
  accented?: boolean;
  onPress: () => void;
  testID: string;
}) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {themeName} = useTheme();
  const color: StaticColor = accented ? 'background_accent_3' : 'background_0';
  const themeColor = getStaticColor(themeName, color);

  const accessibilityLabel = [title, transportationModeTexts, description].join(
    '. ',
  );

  return (
    <View
      style={[styles.ticket, {backgroundColor: themeColor.background}]}
      testID={testID}
    >
      <TouchableOpacity
        onPress={onPress}
        accessible={true}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={t(TicketsTexts.availableTickets.navigateToBuy)}
        style={styles.spreadContent}
      >
        <View style={styles.contentContainer}>
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
            <ThemeText
              type="label__uppercase"
              style={styles.label}
              color={themeColor}
            >
              {transportationModeTexts}
            </ThemeText>
          </View>
          <ThemeText
            type="body__secondary--bold"
            style={styles.ticket_name}
            accessibilityLabel={title}
            color={themeColor}
            testID={testID + 'Title'}
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
          <ThemedTicketIllustration name={ticketIllustration} />
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
  contentContainer: {
    flexShrink: 1,
  },
  ticketIconContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  spreadContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  label: {marginLeft: theme.spacings.xSmall},
  ticketIllustrationContainer: {
    marginTop: theme.spacings.small,
  },
  ticket_name: {
    marginBottom: theme.spacings.small,
    marginTop: theme.spacings.medium,
  },
  description: {marginBottom: theme.spacings.small},
}));

export default Ticket;
