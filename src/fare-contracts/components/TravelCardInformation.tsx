import { ContrastColor } from '@atb-as/theme';
import {ThemeText} from '@atb/components/text';
import {StyleSheet, Theme, useTheme} from '@atb/theme';
import {TravelCard} from '@atb/ticketing';
import {TicketingTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {View} from 'react-native';

type Props = {
  travelCard: TravelCard;
};

const getBackgroundColor = (theme: Theme) => theme.color.background.accent[2]

export const TravelCardInformation: React.FC<Props> = ({travelCard}) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {theme} = useTheme();

  return (
    <View style={styles.container}>
      <ThemeText
        type="heading__component"
        style={{...styles.centerText, ...styles.title}}
      >
        {t(TicketingTexts.travelCardInformation.reisebevis)}
      </ThemeText>
      <ThemeText
        type="body__primary"
        color="secondary"
        style={styles.centerText}
      >
        {t(TicketingTexts.travelCardInformation.onInspection)}
      </ThemeText>
      <ActiveTravelCard
        cardId={travelCard.id?.toString()}
        color={getBackgroundColor(theme)}
       />
      {/* <ThemeText
        type="body__tertiary"
        color="secondary"
        style={styles.centerText}
      >
        {t(TicketingTexts.travelCardInformation.changeInstructions)}
      </ThemeText> */}
    </View>
  );
};

type ActiveTravelCardProps = {
  cardId: string;
  color: ContrastColor;
};

export function ActiveTravelCard(props: ActiveTravelCardProps): JSX.Element {
  const {theme} = useTheme();
  const {cardId = '000000000', color = getBackgroundColor(theme)} = props;
  const formatedTravelCardId = cardId.substr(0, 2) + ' ' + cardId.substr(2);
  const styles = useStyles();

  const {t} = useTranslation();

  return (
    <View
      style={[
        styles.activeTravelCard,
        {backgroundColor: color.background},
      ]}
      accessible={true}
      accessibilityLabel={t(
        TicketingTexts.travelCardInformation.illustrationa11yLabel(
          cardId.toString(),
        ),
      )}
    >
      <View style={styles.cardNumber} accessible={false}>
        <ThemeText
          type="body__tertiary"
          color={color}
          style={styles.transparentText}
        >
          XXXX XX
        </ThemeText>
        <ThemeText type="body__tertiary" color={color}>
          {formatedTravelCardId}
        </ThemeText>
        <ThemeText
          type="body__tertiary"
          color={color}
          style={styles.transparentText}
        >
          X
        </ThemeText>
      </View>
      <View>
        <ThemeText
          type="body__tertiary"
          color={getBackgroundColor(theme)}
          style={styles.tcardicon}
        >
          {'\n'}
          {t(TicketingTexts.travelCardInformation.cardType)}
        </ThemeText>
      </View>
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    marginBottom: theme.spacing.large,
    backgroundColor: theme.color.background.neutral[0].background,
    padding: theme.spacing.xLarge,
    borderRadius: theme.border.radius.medium,
  },
  scrollView: {
    flex: 1,
    padding: theme.spacing.medium,
  },
  centerText: {
    textAlign: 'center',
  },
  title: {
    marginBottom: theme.spacing.small,
  },
  gradient: {
    backgroundColor: theme.color.background.neutral[1].background,
  },

  transparentText: {
    opacity: 0.2,
  },
  activeTravelCard: {
    padding: theme.spacing.large,
    borderRadius: theme.border.radius.medium,
    marginTop: theme.spacing.large,
    marginBottom: theme.spacing.medium,
    alignSelf: 'center',
  },
  cardNumber: {
    flexDirection: 'row',
  },
  tcardicon: {
    borderWidth: 1,
    borderRadius: 2,
    padding: theme.spacing.small,
    alignSelf: 'flex-end',
    marginTop: theme.spacing.small,
    backgroundColor: theme.color.background.neutral[3].foreground.primary,
    textAlign: 'center',
  },
}));
