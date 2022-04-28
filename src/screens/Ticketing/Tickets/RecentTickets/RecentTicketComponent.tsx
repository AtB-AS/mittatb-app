import React from 'react';
import {GenericItem, LinkItem, Section} from '@atb/components/sections';
import ThemeText from '@atb/components/text';
import {useTranslation} from '@atb/translations';
import RecentTicketsTexts from '@atb/translations/screens/subscreens/RecentTicketsTexts';
import {RecentTicket} from '../use-recent-tickets';
import {StyleSheet, useTheme} from '@atb/theme';
import {Dimensions, View, ViewStyle} from 'react-native';
import {getReferenceDataName} from '@atb/reference-data/utils';
import {PreassignedFareProduct} from '@atb/reference-data/types';
import TransportationIcon from '@atb/components/transportation-icon';
import {TransportationModeIconProperties} from '../AvailableTickets/Ticket';

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
      <ThemeText color="background_accent_2">{text}</ThemeText>
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

  const returnModeNames = (modes: TransportationModeIconProperties[]) => {
    if (!modes) return null;
    if (modes.length > 2) return t(RecentTicketsTexts.transportModes.several);
    else
      return modes
        .map((mode) =>
          mode.mode === 'bus' ||
          mode.mode === 'rail' ||
          mode.mode === 'tram' ||
          mode.mode === 'water' ||
          mode.mode === 'air' ||
          mode.mode === 'foot' ||
          mode.mode === 'metro'
            ? t(RecentTicketsTexts.transportModes[mode.mode])
            : t(RecentTicketsTexts.transportModes['unknown']),
        )
        .join('/');
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

  return (
    <View style={styles.container}>
      <Section>
        <GenericItem>
          <View
            style={{
              minWidth: width * 0.6,
              paddingHorizontal: theme.spacings.medium,
              paddingVertical: theme.spacings.medium,
            }}
          >
            <View style={styles.travelModeWrapper}>
              {transportModeIcons.map((icon) => (
                <TransportationIcon
                  mode={icon.mode}
                  subMode={icon.subMode}
                  key={icon.mode + icon.subMode}
                />
              ))}
              <ThemeText type="label__uppercase">
                {returnModeNames(transportModeTexts)}
              </ThemeText>
            </View>

            <View style={styles.section}>
              <ThemeText type="body__secondary--bold">
                {/*returnTicketType(preassignedFareProduct)*/}
                {getReferenceDataName(preassignedFareProduct, language)}
              </ThemeText>
            </View>

            <View style={styles.horizontalFlex}>
              {/*returnDuration(preassignedFareProduct)*/}
              <View>
                <View>
                  <ThemeText type="label__uppercase">
                    {t(RecentTicketsTexts.titles.travellers)}
                  </ThemeText>
                  <View style={styles.travellersTileWrapper}>
                    {userProfilesWithCount.length <= 2 &&
                      userProfilesWithCount.map((u) => (
                        <FloatingLabel
                          text={`${u.count} ${getReferenceDataName(
                            u,
                            language,
                          ).toLowerCase()}`}
                          additionalStyles={{
                            marginRight: theme.spacings.xSmall,
                          }}
                        />
                      ))}
                    {userProfilesWithCount.length > 2 && (
                      <>
                        {userProfilesWithCount.slice(0, 1).map((u) => (
                          <FloatingLabel
                            text={`${u.count} ${getReferenceDataName(
                              u,
                              language,
                            )}`}
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
                <ThemeText type="label__uppercase">
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
        </GenericItem>
        <LinkItem
          text="Gjenta kjøp"
          onPress={() => selectTicket(ticketData)}
          type="spacious"
          interactiveColor="interactive_0"
        />
      </Section>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme, themeName) => ({
  container: {
    display: 'flex',
    alignSelf: 'stretch',
    padding: 0,
    borderRadius: theme.border.radius.regular,
    justifyContent: 'space-between',
    marginHorizontal: theme.spacings.small,
  },
  travelModeWrapper: {
    flexShrink: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: theme.spacings.medium,
  },
  section: {
    marginBottom: theme.spacings.small,
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
}));
