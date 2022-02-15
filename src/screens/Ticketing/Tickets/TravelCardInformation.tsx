import ThemeText from '@atb/components/text';
import {StyleSheet, useTheme} from '@atb/theme';
import {TextNames, ThemeColor} from '@atb/theme/colors';
import {TravelCard} from '@atb/tickets';
import {TicketsTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {View, ViewStyle} from 'react-native';

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
      <ActiveTicketCard
        cardId={travelCard.id?.toString()}
        color="primary_3"
      ></ActiveTicketCard>
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

type ActiveTicketCardProps = {
  cardId: string;
  color: ThemeColor;
  type?: 'normal' | 'large';
};

type tCardStyling = {
  numberTextType: TextNames;
  iconTextType: TextNames;
  containerStyle: ViewStyle;
  cardNumber: ViewStyle;
  iconStyle?: ViewStyle;
};

export function ActiveTicketCard(props: ActiveTicketCardProps): JSX.Element {
  const {cardId = '000000000', color = 'primary_3', type = 'normal'} = props;
  const formatedTravelCardId = cardId.substr(0, 2) + ' ' + cardId.substr(2);
  const styles = useStyles();
  const {theme} = useTheme();

  const {t} = useTranslation();

  const getStyling: () => tCardStyling = () => {
    switch (type) {
      case 'normal':
        return {
          numberTextType: 'body__tertiary',
          iconTextType: 'body__tertiary',
          containerStyle: styles.activeTicketCard,
          cardNumber: styles.cardNumber,
        };
      case 'large':
        return {
          numberTextType: 'body__primary',
          iconTextType: 'body__secondary',
          iconStyle: styles.tcardiconLarge,
          containerStyle: styles.large,
          cardNumber: styles.cardNumber,
        };
    }
  };
  const styling = getStyling();

  return (
    <View
      style={[
        styling.containerStyle,
        {backgroundColor: theme.colors[color].backgroundColor},
      ]}
      accessible={true}
      accessibilityLabel={t(
        TicketsTexts.travelCardInformation.illustrationa11yLabel(
          cardId.toString(),
        ),
      )}
    >
      <View style={styles.cardNumber} accessible={false}>
        <ThemeText
          type={styling.numberTextType}
          color={color}
          style={styles.transparentText}
        >
          XXXX XX
        </ThemeText>
        <ThemeText type={styling.numberTextType} color={color}>
          {formatedTravelCardId}
        </ThemeText>
        <ThemeText
          type={styling.numberTextType}
          color={color}
          style={styles.transparentText}
        >
          X
        </ThemeText>
      </View>
      <View>
        <ThemeText
          type={styling.iconTextType}
          color="primary_1"
          style={[styles.tcardicon, styling.iconStyle]}
        >
          {'\n'}
          {t(TicketsTexts.travelCardInformation.cardType)}
        </ThemeText>
      </View>
    </View>
  );
}

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
    padding: theme.spacings.large,
    borderRadius: theme.border.radius.regular,
    marginTop: theme.spacings.large,
    marginBottom: theme.spacings.medium,
    alignSelf: 'center',
  },
  cardNumber: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    paddingBottom: theme.spacings.medium,
  },
  tcardicon: {
    borderWidth: 1,
    borderRadius: 2,
    alignSelf: 'flex-end',
    marginTop: theme.spacings.small,
    backgroundColor: theme.colors.primary_2.color,
    textAlign: 'center',
    padding: theme.spacings.small,
  },
  tcardiconLarge: {
    padding: theme.spacings.medium,
  },
  large: {
    padding: theme.spacings.xLarge,
    borderRadius: theme.border.radius.regular,
    paddingLeft: theme.spacings.xLarge * 2,
  },
}));

export default TravelCardInformation;
