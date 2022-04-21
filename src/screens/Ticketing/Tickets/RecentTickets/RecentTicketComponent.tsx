import React from 'react';
import {GenericItem, LinkItem, Section} from '@atb/components/sections';
import ThemeText from '@atb/components/text';
import {useTranslation} from '@atb/translations';
import RecentTicketsTexts from '@atb/translations/screens/subscreens/RecentTicketsTexts';
import {RecentTicket} from '../use-recent-tickets';
import {StyleSheet, useTheme} from '@atb/theme';
import {View} from 'react-native';
import {getReferenceDataName} from '@atb/reference-data/utils';
import {useSectionItem} from '@atb/components/sections/section-utils';
import SvgBus from '@atb/assets/svg/mono-icons/transportation/Bus';
import SvgTram from '@atb/assets/svg/mono-icons/transportation/Tram';
import SvgBoat from '@atb/assets/svg/mono-icons/transportation/Boat';
import SvgTrain from '@atb/assets/svg/mono-icons/transportation/Train';
import {PreassignedFareProduct} from '@atb/reference-data/types';

type transportMode = 'bus' | 'tram' | 'rail' | 'boat';
type recentTicketProps = {
  ticketData: RecentTicket;
  transportModes: transportMode[];
  selectTicket: (ticketData: RecentTicket) => void;
};

export const FloatingLabel = ({text}: {text: string}) => {
  const styles = useStyles();
  return (
    <View style={styles.blueLabel}>
      <ThemeText>{text}</ThemeText>
    </View>
  );
};

export const RecentTicketComponent = ({
  ticketData,
  transportModes,
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
  const {topContainer} = useSectionItem({type: 'inline'});

  const returnModeNames = (capitalized?: boolean) => {
    if (transportModes.length > 2)
      return t(RecentTicketsTexts.transportModes.several);
    else
      return transportModes
        .map((mode) =>
          capitalized
            ? t(RecentTicketsTexts.transportModes[mode]).toUpperCase()
            : t(RecentTicketsTexts.transportModes[mode]),
        )
        .join(' / ');
  };

  const returnModeIcons = (modes: transportMode[]) => {
    let colorRef = '';

    return modes.map((mode) => (
      <View
        style={[
          styles.iconFrame,
          {
            backgroundColor: theme.colors.transport_boat.backgroundColor,
          },
        ]}
      >
        {mode === 'bus' && <SvgBus />}
        {mode === 'tram' && <SvgTram />}
        {mode === 'boat' && <SvgBoat />}
        {mode === 'rail' && <SvgTrain />}
      </View>
    ));
  };

  const returnTicketType = (preassignedFareProduct: PreassignedFareProduct) => {
    return t(RecentTicketsTexts.ticketTypes[preassignedFareProduct.type]);
  };

  const returnDuration = (preassignedFareProduct: PreassignedFareProduct) => {
    const {durationDays} = preassignedFareProduct;

    if (durationDays === 1)
      return (
        <FloatingLabel text={`24 ${t(RecentTicketsTexts.titles.hours)}`} />
      );
    else {
      return (
        <FloatingLabel
          text={`${durationDays} ${t(RecentTicketsTexts.titles.days)}`}
        />
      );
    }
  };

  return (
    <View style={[topContainer, styles.container]}>
      <Section>
        <GenericItem>
          <View style={styles.tileWrapperView}>
            <View style={styles.travelModesWrapper}>
              <View style={styles.travelModeIcons}>
                {returnModeIcons(transportModes)}
              </View>
              <ThemeText type="body__tertiary">
                {returnModeNames(true)}
              </ThemeText>
            </View>

            <View style={styles.section}>
              <ThemeText type="body__secondary--bold">
                {returnTicketType(preassignedFareProduct)}
              </ThemeText>
            </View>

            <View style={styles.horizontalFlex}>
              <View style={styles.section}>
                {preassignedFareProduct.durationDays && (
                  <View>
                    <ThemeText type="body__tertiary">
                      {t(RecentTicketsTexts.titles.duration)}
                    </ThemeText>
                    {returnDuration(preassignedFareProduct)}
                  </View>
                )}

                <ThemeText type="body__tertiary">
                  {t(RecentTicketsTexts.titles.travellers)}
                </ThemeText>
                {userProfilesWithCount.length < 2 &&
                  userProfilesWithCount.map((u) => (
                    <FloatingLabel
                      text={`${u.count} ${getReferenceDataName(
                        u,
                        language,
                      ).toLowerCase()}`}
                    />
                  ))}
                {userProfilesWithCount.length >= 2 && (
                  <>
                    {userProfilesWithCount.slice(0, 1).map((u) => (
                      <FloatingLabel
                        text={`${u.count} ${getReferenceDataName(u, language)}`}
                      />
                    ))}
                    <View style={styles.additionalCategories}>
                      <ThemeText>
                        + {userProfilesWithCount.slice(1).length} andre
                        kategorier
                      </ThemeText>
                    </View>
                  </>
                )}
              </View>

              <View style={styles.section}>
                <ThemeText type="body__tertiary">
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
      </Section>

      <LinkItem
        backgroundColor={theme.colors.primary_2.backgroundColor}
        contentColor={theme.colors.primary_2.color}
        text="Gjenta kjøp"
        onPress={() => selectTicket(ticketData)}
        overrideContainerStyles={{
          paddingHorizontal: theme.spacings.xLarge,
          borderBottomLeftRadius: theme.border.radius.regular,
          borderBottomRightRadius: theme.border.radius.regular,
        }}
      />
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    display: 'flex',
    padding: 0,
    borderRadius: theme.border.radius.regular,
    justifyContent: 'space-between',
    marginHorizontal: theme.spacings.small,
    height: '100%',
  },
  tileWrapperView: {
    minWidth: 250,
    padding: theme.spacings.medium,
  },
  travelModesWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  travelModeIcons: {
    display: 'flex',
    flexDirection: 'row',
    marginRight: theme.spacings.medium,
    marginBottom: theme.spacings.large,
  },
  iconFrame: {
    padding: theme.spacings.xSmall,
    marginRight: theme.spacings.xSmall,
  },
  section: {
    marginBottom: theme.spacings.small,
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
    backgroundColor: theme.colors.primary_3.backgroundColor,
    borderRadius: theme.border.radius.regular,
  },
  additionalCategories: {
    marginHorizontal: theme.spacings.medium,
    marginVertical: theme.spacings.small,
  },
}));
