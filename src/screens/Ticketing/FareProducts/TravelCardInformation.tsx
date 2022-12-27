import ThemeText from '@atb/components/text';
import {StyleSheet, useTheme} from '@atb/theme';
import {flatStaticColors, StaticColor} from '@atb/theme/colors';
import {TravelCard} from '@atb/ticketing';
import {TicketingTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {View} from 'react-native';

type Props = {
  travelCard: TravelCard;
};

const TravelCardInformation: React.FC<Props> = ({travelCard}) => {
  const styles = useStyles();
  const {t} = useTranslation();

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
        color="background_accent_2"
      ></ActiveTravelCard>
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
  color: StaticColor;
};

export function ActiveTravelCard(props: ActiveTravelCardProps): JSX.Element {
  const {cardId = '000000000', color = 'background_accent_2'} = props;
  const formatedTravelCardId = cardId.substr(0, 2) + ' ' + cardId.substr(2);
  const styles = useStyles();
  const {themeName} = useTheme();

  const {t} = useTranslation();

  return (
    <View
      style={[
        styles.activeTravelCard,
        {backgroundColor: flatStaticColors[themeName][color].background},
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
          color="background_accent_2"
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
    marginBottom: theme.spacings.large,
    backgroundColor: theme.static.background.background_0.background,
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
    backgroundColor: theme.static.background.background_1.background,
  },

  transparentText: {
    opacity: 0.2,
  },
  activeTravelCard: {
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
    backgroundColor: theme.static.background.background_accent_3.text,
    textAlign: 'center',
  },
}));

export default TravelCardInformation;
