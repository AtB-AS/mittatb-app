import React from 'react';
import ThemeText from '@atb/components/text';
import {useTranslation} from '@atb/translations';
import RecentTicketsTexts from '@atb/translations/screens/subscreens/RecentTicketsTexts';
import {RecentTicket} from '../use-recent-tickets';
import {StyleSheet, useTheme} from '@atb/theme';
import {Dimensions, TouchableOpacity, View, ViewStyle} from 'react-native';
import {getReferenceDataName} from '@atb/reference-data/utils';
import {PreassignedFareProduct} from '@atb/reference-data/types';
import TransportationIcon from '@atb/components/transportation-icon';
import {TransportationModeIconProperties} from '../AvailableTickets/Ticket';
import ThemeIcon from '@atb/components/theme-icon';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';

type recentTicketProps = {
  ticketData: RecentTicket;
  transportModeTexts: TransportationModeIconProperties[];
  transportModeIcons: TransportationModeIconProperties[];
  selectTicket: (ticketData: RecentTicket) => void;
};

export const FloatingLabel = ({
  text,
  additionalStyles,
}: {
  text: string;
  additionalStyles?: ViewStyle;
}) => {
  const styles = useStyles();
  return (
    <View
      style={
        additionalStyles
          ? [styles.blueLabel, additionalStyles]
          : styles.blueLabel
      }
    >
      <ThemeText type="body__tertiary" color="background_accent_2">
        {text}
      </ThemeText>
    </View>
  );
};

export const RecentTicketComponent = ({
  ticketData,
  transportModeIcons,
  transportModeTexts,
  selectTicket,
}: recentTicketProps) => {
  const {
    preassignedFareProduct,
    fromTariffZone,
    toTariffZone,
    userProfilesWithCount,
  } = ticketData;
  const {language} = useTranslation();
  const styles = useStyles();
  const {theme} = useTheme();
  const {t} = useTranslation();
  const fromZone = fromTariffZone.name.value;
  const toZone = toTariffZone.name.value;
  const {width} = Dimensions.get('window');

  type modeNameProps = {
    modes: TransportationModeIconProperties[];
    joinSymbol?: string;
  };

  const modeNames = ({modes, joinSymbol = '/'}: modeNameProps) => {
    if (!modes) return null;
    if (modes.length > 2) return t(RecentTicketsTexts.severalTransportModes);
    else
      return modes
        .map((mode) => t(RecentTicketsTexts.transportMode(mode.mode)))
        .join(joinSymbol);
  };

  const returnTicketType = (preassignedFareProduct: PreassignedFareProduct) => {
    return t(RecentTicketsTexts.ticketTypes[preassignedFareProduct.type]);
  };

  const returnDuration = (preassignedFareProduct: PreassignedFareProduct) => {
    const {durationDays, type} = preassignedFareProduct;

    if (type === 'period') {
      let textString = ``;
      if (durationDays === 1)
        textString = `24 ${t(RecentTicketsTexts.titles.hours)}`;
      else {
        textString = `${durationDays} ${t(RecentTicketsTexts.titles.days)}`;
      }
      return (
        <View>
          <ThemeText type="label__uppercase">
            {t(RecentTicketsTexts.titles.duration)}
          </ThemeText>
          <FloatingLabel text={textString} />
        </View>
      );
    }
  };

  const returnAccessabilityLabel = () => {
    const modeInfo = `${getReferenceDataName(
      preassignedFareProduct,
      language,
    )}${t(RecentTicketsTexts.a11yPreLabels.transportModes)} ${modeNames({
      modes: transportModeTexts,
      joinSymbol: t(RecentTicketsTexts.a11yPreLabels.and),
    })}`;

    const travellerInfo = `${t(
      RecentTicketsTexts.a11yPreLabels.travellers,
    )}: ${userProfilesWithCount
      .map((u) => '1' + getReferenceDataName(u, language))
      .join(', ')}`;

    const zoneInfo = `${
      fromZone === toZone
        ? `${t(RecentTicketsTexts.a11yPreLabels.zones.oneZone)} ${fromZone}`
        : `${t(
            RecentTicketsTexts.a11yPreLabels.zones.multipleZones,
          )} ${fromZone}, ${toZone}`
    }`;

    return `${modeInfo} ${travellerInfo} ${zoneInfo}`;
  };

  const currentAccessabilityLabel = returnAccessabilityLabel();

  const buttonColor = theme.interactive.interactive_0.default;

  return (
    <View style={styles.container}>
      <View
        style={[styles.upperPart, {minWidth: width * 0.6}]}
        accessible={true}
        accessibilityLabel={currentAccessabilityLabel}
      >
        <View style={styles.travelModeWrapper}>
          {transportModeIcons.map((icon) => (
            <TransportationIcon
              mode={icon.mode}
              subMode={icon.subMode}
              key={icon.mode + icon.subMode}
              size="small"
            />
          ))}

          <ThemeText type="label__uppercase">
            {modeNames({modes: transportModeTexts})}
          </ThemeText>
        </View>

        <View style={styles.productName}>
          <ThemeText type="body__secondary--bold">
            {/*returnTicketType(preassignedFareProduct)*/}
            {getReferenceDataName(preassignedFareProduct, language)}
          </ThemeText>
        </View>

        <View style={styles.horizontalFlex}>
          {/*returnDuration(preassignedFareProduct)*/}
          <View>
            <View>
              <ThemeText type="label__uppercase" color="secondary">
                {t(RecentTicketsTexts.titles.travellers)}
              </ThemeText>
              <View style={styles.travellersTileWrapper}>
                {userProfilesWithCount.length <= 2 &&
                  userProfilesWithCount.map((u) => (
                    <FloatingLabel
                      key={u.id}
                      text={`${u.count} ${getReferenceDataName(u, language)}`}
                      additionalStyles={{
                        marginRight: theme.spacings.xSmall,
                      }}
                    />
                  ))}
                {userProfilesWithCount.length > 2 && (
                  <>
                    {userProfilesWithCount.slice(0, 1).map((u) => (
                      <FloatingLabel
                        text={`${u.count} ${getReferenceDataName(u, language)}`}
                      />
                    ))}
                    <View style={styles.additionalCategories}>
                      <ThemeText>
                        + {userProfilesWithCount.slice(1).length}{' '}
                        {t(RecentTicketsTexts.titles.moreTravelers)}
                      </ThemeText>
                    </View>
                  </>
                )}
              </View>
            </View>
          </View>
          <View>
            <ThemeText type="label__uppercase" color="secondary">
              {t(RecentTicketsTexts.titles.zone)}
            </ThemeText>
            {fromZone === toZone ? (
              <FloatingLabel text={`${fromZone}`} />
            ) : (
              <FloatingLabel text={`${fromZone} - ${toZone}`} />
            )}
          </View>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => selectTicket(ticketData)}
        style={[styles.buyButton, {backgroundColor: buttonColor.background}]}
        accessible={true}
      >
        <ThemeText color={buttonColor}>
          {t(RecentTicketsTexts.repeatPurchase)}
        </ThemeText>
        <ThemeIcon svg={ArrowRight} fill={buttonColor.text} />
      </TouchableOpacity>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme, themeName) => ({
  container: {
    marginHorizontal: theme.spacings.small,
    backgroundColor: theme.static.background.background_0.background,
    borderRadius: theme.border.radius.regular,
    overflow: 'hidden',
  },
  upperPart: {
    padding: theme.spacings.xLarge,
    flexGrow: 1,
  },
  travelModeWrapper: {
    flexShrink: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: theme.spacings.medium,
  },
  productName: {
    marginBottom: theme.spacings.medium,
  },
  travellersTileWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  horizontalFlex: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  blueLabel: {
    marginVertical: theme.spacings.xSmall,
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacings.medium,
    paddingVertical: theme.spacings.xSmall,
    backgroundColor: theme.static.background.background_accent_2.background,
    borderRadius: theme.border.radius.regular,
  },
  additionalCategories: {
    marginHorizontal: theme.spacings.small,
    marginVertical: theme.spacings.small,
  },
  buyButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacings.xLarge,
    paddingVertical: theme.spacings.medium,
  },
}));
