import {ThemeText} from '@atb/components/text';
import {
  useFirestoreConfigurationContext,
  FareProductTypeConfig,
} from '@atb/modules/configuration';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {TicketingTexts, useTranslation} from '@atb/translations';
import RecentFareContractsTexts from '@atb/translations/screens/subscreens/RecentFareContractsTexts';
import React, {useMemo} from 'react';
import {View, ScrollView} from 'react-native';
import {useTicketingContext} from '@atb/modules/ticketing';
import {StopPlaceFragment} from '@atb/api/types/generated/fragments/stop-places';
import {
  RecentFareContract,
  type RecentFareContractType,
} from '@atb/recent-fare-contracts';
import {isProductSellableInApp} from '@atb/utils/is-product-sellable-in-app';

type Props = {
  recentFareContracts: RecentFareContractType[];
  loading: boolean;
  onSelect: (
    rfc: RecentFareContractType,
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
  const {theme} = useThemeContext();
  const {t} = useTranslation();
  const {fareProductTypeConfigs} = useFirestoreConfigurationContext();
  const {customerProfile} = useTicketingContext();

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
      {loading && !memoizedRecentFareContracts.length && (
        <View
          style={{
            paddingVertical: theme.spacing.xLarge,
          }}
          accessible={true}
          accessibilityLabel={t(RecentFareContractsTexts.titles.loading)}
        >
          <ThemeText
            typography="body__m"
            style={{textAlign: 'center', marginBottom: theme.spacing.large}}
          >
            {t(TicketingTexts.recentFareContracts.loading)}
          </ThemeText>
          <View color={theme.color.background.neutral[0].foreground.primary} />
        </View>
      )}

      {!!memoizedRecentFareContracts.length && (
        <>
          <ThemeText typography="body__s" style={styles.header}>
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
                <RecentFareContract
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
