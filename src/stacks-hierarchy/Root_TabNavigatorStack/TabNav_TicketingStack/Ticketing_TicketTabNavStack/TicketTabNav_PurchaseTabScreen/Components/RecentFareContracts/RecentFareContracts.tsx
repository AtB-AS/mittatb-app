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
import {StopPlaceFragment} from '@atb/api/types/generated/fragments/stop-places';

type Props = {
  recentFareContracts: RecentFareContract[];
  loading: boolean;
  onSelect: (
    rfc: RecentFareContract,
    fareProductTypeConfig: FareProductTypeConfig,
    harbors?: StopPlaceFragment[],
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
            paddingVertical: theme.spacing.xLarge,
          }}
          accessible={true}
          accessibilityLabel={t(RecentFareContractsTexts.titles.loading)}
        >
          <ThemeText
            typography="body__primary"
            style={{textAlign: 'center', marginBottom: theme.spacing.large}}
          >
            {t(TicketingTexts.recentFareContracts.loading)}
          </ThemeText>
          <ActivityIndicator
            color={theme.color.background.neutral[0].foreground.primary}
          />
        </View>
      )}

      {!loading && !!memoizedRecentFareContracts.length && (
        <>
          <ThemeText typography="body__secondary" style={styles.header}>
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
    marginVertical: theme.spacing.medium,
    columnGap: theme.spacing.medium,
  },
  scrollViewContent: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.medium,
    columnGap: theme.spacing.medium,
  },
  header: {
    marginTop: theme.spacing.xLarge,
    marginLeft: theme.spacing.xLarge,
  },
}));
