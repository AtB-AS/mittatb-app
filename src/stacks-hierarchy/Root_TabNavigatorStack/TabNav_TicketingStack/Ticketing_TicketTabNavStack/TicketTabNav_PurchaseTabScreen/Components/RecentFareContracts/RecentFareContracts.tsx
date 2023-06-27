import {ThemeText} from '@atb/components/text';
import {productIsSellableInApp} from '@atb/reference-data/utils';
import {StyleSheet, useTheme} from '@atb/theme';
import {TicketingTexts, useTranslation} from '@atb/translations';
import RecentFareContractsTexts from '@atb/translations/screens/subscreens/RecentFareContractsTexts';
import React, {useMemo} from 'react';
import {ActivityIndicator, ScrollView, View} from 'react-native';
import {useRecentFareContracts} from '../../use-recent-fare-contracts';
import {RecentFareContractComponent} from './RecentFareContractComponent';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import {FareProductTypeConfig} from '@atb/configuration';
import {RecentFareContract} from '../../types';

type Props = {
  onSelect: (
    rfc: RecentFareContract,
    fareProductTypeConfig: FareProductTypeConfig,
  ) => void;
};

export const RecentFareContracts = ({onSelect}: Props) => {
  const styles = useStyles();
  const {theme} = useTheme();
  const {t} = useTranslation();
  const {recentFareContracts, loading} = useRecentFareContracts();
  const {fareProductTypeConfigs} = useFirestoreConfiguration();

  const filterRecentFareContracts = (
    recentFareContracts: RecentFareContract[],
  ) =>
    recentFareContracts
      .filter((rfc) =>
        fareProductTypeConfigs.some(
          (c) => c.type === rfc.preassignedFareProduct.type,
        ),
      )
      .filter((rfc) => productIsSellableInApp(rfc.preassignedFareProduct));

  const memoizedRecentFareContracts = useMemo(
    () => filterRecentFareContracts(recentFareContracts),
    [recentFareContracts],
  );

  return (
    <View>
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

      {!loading && !!memoizedRecentFareContracts.length && (
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
              return (
                <RecentFareContractComponent
                  key={rfc.id}
                  recentFareContract={rfc}
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
