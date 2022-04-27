import {
  Mode,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {SvgProps} from 'react-native-svg';
import {TouchableOpacity, View} from 'react-native';
import TransportationIcon from '@atb/components/transportation-icon';
import ThemeText from '@atb/components/text';
import React from 'react';
import {StyleSheet} from '@atb/theme';
import ThemedTicketIllustration, {
  TicketIllustration,
} from '@atb/components/ticket-illustration';

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
  const ticketTheme = accented ? styles.ticket_accented : styles.ticket_normal;
  const textColor = accented ? 'primary_2' : 'primary';
  const accessibilityLabel = [title, description, transportationModeTexts].join(
    '. ',
  );

  return (
    <View style={[styles.ticket, ticketTheme]}>
      <TouchableOpacity
        onPress={onPress}
        accessible={true}
        accessibilityLabel={accessibilityLabel}
      >
        <View style={{flexShrink: 1}}>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            {transportationModeIcons.map((icon) => {
              return (
                <TransportationIcon
                  mode={icon.mode}
                  subMode={icon.subMode}
                  key={icon.mode + icon.subMode}
                />
              );
            })}
            <ThemeText
              type="body__tertiary"
              style={styles.transportation_label}
              color={textColor}
            >
              {transportationModeTexts}
            </ThemeText>
          </View>
          <ThemeText
            type="body__secondary--bold"
            style={styles.ticket_name}
            accessibilityLabel={title}
            color={textColor}
          >
            {title}
          </ThemeText>
          <ThemeText
            type="body__tertiary"
            style={styles.description}
            color={textColor}
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
    backgroundColor: theme.colors.background_0.backgroundColor,
  },
  ticket_accented: {
    backgroundColor: theme.colors.primary_2.backgroundColor,
    textColor: theme.colors.primary_2.color,
  },

  ticketIllustrationContainer: {
    flexGrow: 1,
    flexDirection: 'row',
    marginTop: theme.spacings.small,
  },
  ticketIllustration: {
    alignSelf: 'flex-end',
    opacity: 0.6,
  },
  label_uppercase: {
    // TODO: this will be part of design system
  },
  transportation_label: {
    textTransform: 'uppercase',
  },
  ticket_name: {
    marginBottom: theme.spacings.small,
    marginTop: theme.spacings.small,
  },
  description: {},
}));

export default Ticket;
