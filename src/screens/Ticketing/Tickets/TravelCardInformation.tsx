import ThemeText from '@atb/components/text';
import {StyleSheet, useTheme} from '@atb/theme';
import {TravelCard} from '@atb/tickets';
import {TicketsTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {View} from 'react-native';

type Props = {
  travelCard: TravelCard;
};

const TravelCardInformation: React.FC<Props> = ({travelCard}) => {
  const {theme} = useTheme();
  const styles = useStyles();
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <ThemeText
        type="heading__component"
        style={{...styles.centerText, ...styles.title}}
      >
        {t(TicketsTexts.travelCardInformation.reisebevis)}
      </ThemeText>
      <ThemeText
        type="body__primary"
        color="secondary"
        style={styles.centerText}
      >
        {t(TicketsTexts.travelCardInformation.onInspection)}
      </ThemeText>
      <ActiveTicketCard cardId={travelCard.id?.toString()}></ActiveTicketCard>
      {/* <ThemeText
        type="body__tertiary"
        color="secondary"
        style={styles.centerText}
      >
        {t(TicketsTexts.travelCardInformation.changeInstructions)}
      </ThemeText> */}
    </View>
  );
};

const ActiveTicketCard: React.FC<{cardId?: string}> = ({
  cardId = '00 0000000',
}) => {
  const formatedTravelCardId = cardId.substr(0, 2) + ' ' + cardId.substr(2);
  const styles = useStyles();

  const {t} = useTranslation();

  return (
    <View
      style={styles.activeTicketCard}
      accessible={true}
      accessibilityLabel={t(
        TicketsTexts.travelCardInformation.illustrationa11yLabel(
          cardId.toString(),
        ),
      )}
    >
      <View style={styles.cardNumber} accessible={false}>
        <ThemeText
          type="body__tertiary"
          color="primary_1"
          style={styles.transparentText}
        >
          XXXX XX
        </ThemeText>
        <ThemeText type="body__tertiary" color="primary_1">
          {formatedTravelCardId}
        </ThemeText>
        <ThemeText
          type="body__tertiary"
          color="primary_1"
          style={styles.transparentText}
        >
          X
        </ThemeText>
      </View>
      <View>
        <ThemeText
          type="body__tertiary"
          color="primary_1"
          style={styles.tcardicon}
        >
          {'\n'}
          {t(TicketsTexts.travelCardInformation.tCard)}
        </ThemeText>
      </View>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    marginBottom: theme.spacings.large,
    backgroundColor: theme.colors.background_0.backgroundColor,
    padding: theme.spacings.xLarge,
    borderRadius: theme.border.radius.regular,
  },
  scrollView: {
    flex: 1,
    padding: theme.spacings.medium,
  },
  centerText: {
    textAlign: 'center',
  },
  title: {
    marginBottom: theme.spacings.small,
  },
  gradient: {
    backgroundColor: theme.colors.background_1.backgroundColor,
  },

  transparentText: {
    opacity: 0.2,
  },
  activeTicketCard: {
    // backgroundColor: theme.colors.background_3.backgroundColor,
    backgroundColor: theme.colors.primary_3.backgroundColor,
    padding: theme.spacings.large,
    borderRadius: theme.border.radius.regular,
    marginTop: theme.spacings.large,
    marginBottom: theme.spacings.medium,
    alignSelf: 'center',
  },
  cardNumber: {
    flexDirection: 'row',
  },
  tcardicon: {
    borderWidth: 1,
    borderRadius: 2,
    padding: theme.spacings.small,
    alignSelf: 'flex-end',
    marginTop: theme.spacings.small,
    backgroundColor: theme.colors.primary_2.color,
    textAlign: 'center',
  },
}));

export default TravelCardInformation;
