import {
  Mode,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';
import ThemeText from '@atb/components/text';
import {productIsSellableInApp} from '@atb/reference-data/utils';
import {StyleSheet, useTheme} from '@atb/theme';
import {TicketingTexts, useTranslation} from '@atb/translations';
import RecentFareContractsTexts from '@atb/translations/screens/subscreens/RecentFareContractsTexts';
import {useNavigation} from '@react-navigation/native';
import React, {useMemo} from 'react';
import {ActivityIndicator, ScrollView, View} from 'react-native';
import {TicketingNavigationProps} from '../../types';
import useRecentFareContracts, {
  RecentFareContract,
} from '../use-recent-fare-contracts';
import {RecentFareContractComponent} from './RecentFareContractComponent';

export const RecentFareContracts = () => {
  const navigation = useNavigation<TicketingNavigationProps<'PurchaseTab'>>();
  const styles = useStyles();
  const {theme} = useTheme();
  const {t} = useTranslation();
  const {recentFareContracts, loading} = useRecentFareContracts();

  const onSelect = (rfc: RecentFareContract) => {
    navigation.navigate('TicketPurchase', {
      screen: 'PurchaseOverview',
      params: {
        preassignedFareProduct: rfc.preassignedFareProduct,
        userProfilesWithCount: rfc.userProfilesWithCount,
        fromTariffZone: {...rfc.fromTariffZone, resultType: 'zone'},
        toTariffZone: {...rfc.toTariffZone, resultType: 'zone'},
      },
    });
  };

  const filterRecentFareContracts = (
    recentFareContracts: RecentFareContract[],
  ) =>
    recentFareContracts
      .filter((rfc) => {
        const fareProductType = rfc.preassignedFareProduct.type;
        return (
          fareProductType === 'single' ||
          fareProductType === 'period' ||
          fareProductType === 'carnet' ||
          fareProductType === 'hour24'
        );
      })
      .filter((rfc) => productIsSellableInApp(rfc.preassignedFareProduct));

  const memoizedRecentFareContracts = useMemo(
    () => filterRecentFareContracts(recentFareContracts),
    [recentFareContracts],
  );

  return (
    <View
      style={{backgroundColor: theme.static.background.background_1.background}}
    >
      {loading && (
        <View
          style={{
            paddingVertical: theme.spacings.xLarge,
          }}
          accessible={true}
          accessibilityLabel={t(RecentFareContractsTexts.titles.loading)}
        >
          <ThemeText
            type="body__primary"
            style={{textAlign: 'center', marginBottom: theme.spacings.large}}
          >
            {t(TicketingTexts.recentFareContracts.loading)}
          </ThemeText>
          <ActivityIndicator
            color={theme.static.background.background_0.text}
          />
        </View>
      )}

      {!loading && !!recentFareContracts.length && (
        <>
          <ThemeText type="body__secondary" style={styles.header}>
            {t(RecentFareContractsTexts.repeatPurchase.label)}
          </ThemeText>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              paddingHorizontal: theme.spacings.xSmall,
            }}
            style={styles.horizontalScrollView}
            testID="recentTicketsScrollView"
          >
            {memoizedRecentFareContracts.map((rfc) => {
              const componentKey =
                rfc.preassignedFareProduct.id +
                rfc.userProfilesWithCount
                  .map((traveller) => {
                    return traveller.count + traveller.userTypeString;
                  })
                  .join();
              return (
                <RecentFareContractComponent
                  key={componentKey}
                  recentFareContract={rfc}
                  transportModeTexts={[
                    {
                      mode: Mode.Bus,
                    },
                    {
                      mode: Mode.Tram,
                    },
                  ]}
                  transportModeIcons={[
                    {mode: Mode.Bus, subMode: TransportSubmode.LocalBus},
                  ]}
                  onSelect={onSelect}
                  testID={'recent' + memoizedRecentFareContracts.indexOf(rfc)}
                />
              );
            })}
          </ScrollView>
        </>
      )}
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  horizontalScrollView: {
    marginVertical: theme.spacings.medium,
  },
  header: {
    marginTop: theme.spacings.xLarge,
    marginLeft: theme.spacings.xLarge,
  },
}));
