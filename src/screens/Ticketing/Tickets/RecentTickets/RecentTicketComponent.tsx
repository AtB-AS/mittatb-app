import React, {useState} from 'react';
import {GenericItem, LinkItem, Section} from '@atb/components/sections';
import ThemeText from '@atb/components/text';
import {useTranslation} from '@atb/translations';
import RecentTicketsTexts from '@atb/translations/screens/subscreens/RecentTicketsTexts';
import useRecentTickets, {RecentTicket} from '../use-recent-tickets';
import {StyleSheet, useTheme} from '@atb/theme';
import {View} from 'react-native';
import {getReferenceDataName} from '@atb/reference-data/utils';

type transportMode = 'bus' | 'tram' | 'rail';
type recentTicketProps = {
  ticketData: RecentTicket;
  extraData: {
    transportModes: transportMode[];
  };
  selectTicket: (ticketData: RecentTicket) => void;
};

export const RecentTicketComponent = ({
  ticketData,
  extraData,
  selectTicket,
}: recentTicketProps) => {
  const {
    preassignedFareProduct,
    fromTariffZone,
    toTariffZone,
    userProfilesWithCount,
  } = ticketData;
  const {transportModes} = extraData;
  const {language} = useTranslation();
  const styles = useStyles();
  const {theme} = useTheme();
  const {t} = useTranslation();
  const fromZone = fromTariffZone.name.value;
  const toZone = toTariffZone.name.value;

  const returnModes = (capitalized?: boolean) => {
    return transportModes
      .map((mode) =>
        capitalized
          ? t(RecentTicketsTexts.transportModes[mode]).toUpperCase()
          : t(RecentTicketsTexts.transportModes[mode]),
      )
      .join(' / ');
  };

  return (
    <Section style={styles.container}>
      <GenericItem>
        <View style={styles.tileWrapperView}>
          <View style={styles.section}>
            <ThemeText type="body__tertiary">{returnModes(true)}</ThemeText>
          </View>

          <View style={styles.section}>
            <ThemeText type="body__secondary">{`Enkeltbillett - ${returnModes()}`}</ThemeText>
          </View>

          <View style={styles.horizontalFlex}>
            <View style={styles.section}>
              <ThemeText type="body__tertiary">Reisende</ThemeText>
              <ThemeText>1 voksen</ThemeText>
            </View>

            <View style={styles.section}>
              <ThemeText type="body__tertiary">Sone</ThemeText>
              <ThemeText>
                {fromZone === toZone
                  ? `${fromZone}`
                  : `${fromZone} - ${toZone}`}
              </ThemeText>
            </View>
          </View>
        </View>
      </GenericItem>
      <LinkItem
        backgroundColor={theme.colors.primary_2.backgroundColor}
        contentColor={theme.colors.primary_2.color}
        text="Gjenta kjøp"
        onPress={() => selectTicket(ticketData)}
        overrideContainerStyles={{
          paddingHorizontal: theme.spacings.xLarge,
        }}
      />
    </Section>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    width: '67%',
    marginBottom: theme.spacings.small,
    marginRight: theme.spacings.medium,
    borderRadius: theme.border.radius.circle,
  },
  tileWrapperView: {
    padding: theme.spacings.medium,
  },
  section: {
    marginBottom: theme.spacings.small,
  },
  horizontalFlex: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
}));
