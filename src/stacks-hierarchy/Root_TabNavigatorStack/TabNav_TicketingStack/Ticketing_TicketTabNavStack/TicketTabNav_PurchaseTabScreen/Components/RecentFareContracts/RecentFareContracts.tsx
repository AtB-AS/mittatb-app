import {ThemeText} from '@atb/components/text';
import {
  isProductSellableInApp,
  useFirestoreConfiguration,
  FareProductTypeConfig,
} from '@atb/configuration';
import {StyleSheet, useTheme} from '@atb/theme';
import {TicketingTexts, useTranslation} from '@atb/translations';
import RecentFareContractsTexts from '@atb/translations/screens/subscreens/RecentFareContractsTexts';
import React, {useMemo} from 'react';
import {ActivityIndicator, ScrollView, View} from 'react-native';
import {RecentFareContractComponent} from './RecentFareContractComponent';
import {RecentFareContract} from '../../types';
import {useTicketingState} from '@atb/ticketing';

type Props = {
  recentFareContracts: RecentFareContract[];
  loading: boolean;
  onSelect: (
    rfc: RecentFareContract,
    fareProductTypeConfig: FareProductTypeConfig,
  ) => void;
};

export const RecentFareContracts = ({
  recentFareContracts,
  loading,
  onSelect,
}: Props) => {
  const styles = useStyles();
  const {theme} = useTheme();
  const {t} = useTranslation();
  const {fareProductTypeConfigs} = useFirestoreConfiguration();
  const {customerProfile} = useTicketingState();

  const memoizedRecentFareContracts = useMemo(
    () =>
      recentFareContracts
        .filter((rfc) =>
          fareProductTypeConfigs.some(
            (c) => c.type === rfc.preassignedFareProduct.type,
          ),
        )
        .filter((rfc) =>
          isProductSellableInApp(rfc.preassignedFareProduct, customerProfile),
        ),
    [recentFareContracts, fareProductTypeConfigs, customerProfile],
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
            contentContainerStyle={styles.scrollViewContent}
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
    columnGap: theme.spacings.medium,
  },
  scrollViewContent: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacings.medium,
    columnGap: theme.spacings.medium,
  },
  header: {
    marginTop: theme.spacings.xLarge,
    marginLeft: theme.spacings.xLarge,
  },
}));
