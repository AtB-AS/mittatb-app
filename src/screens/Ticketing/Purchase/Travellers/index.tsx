import SvgProfile from '@atb/assets/svg/icons/tab-bar/Profile';
import Button from '@atb/components/button';
import Header from '@atb/components/screen-header';
import * as Sections from '@atb/components/sections';
import ThemeText from '@atb/components/text';
import ThemeIcon from '@atb/components/theme-icon';
import {DismissableStackNavigationProp} from '@atb/navigation/createDismissableStackNavigator';
import {StyleSheet, useTheme} from '@atb/theme';
import {TravellersTexts, useTranslation} from '@atb/translations';
import {RouteProp} from '@react-navigation/native';
import React from 'react';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {TicketingStackParams} from '../';
import {createTravellersText} from '../Overview';
import SingleTravellerSelection from './SingleTravellerSelection';
import MultipleTravellersSelection from './MultipleTravellersSelection';
import useUserCountState from './use-user-count-state';
import {getPurchaseFlow} from '@atb/screens/Ticketing/Purchase/utils';

export type TravellersProps = {
  navigation: DismissableStackNavigationProp<
    TicketingStackParams,
    'Travellers'
  >;
  route: RouteProp<TicketingStackParams, 'Travellers'>;
};

const Travellers: React.FC<TravellersProps> = ({
  navigation,
  route: {params},
}) => {
  const styles = useStyles();
  const {theme} = useTheme();
  const {t, language} = useTranslation();
  const {travellerSelectionMode} = getPurchaseFlow(
    params.preassignedFareProduct,
  );

  const userCountState = useUserCountState(params.userProfilesWithCount);

  const {top: safeAreaTop, bottom: safeAreBottom} = useSafeAreaInsets();

  return (
    <View style={[styles.container, {paddingTop: safeAreaTop}]}>
      <Header
        title={t(TravellersTexts.header.title)}
        leftButton={{type: 'back'}}
      />

      <ScrollView style={styles.travellerCounters}>
        <View style={styles.summarySection}>
          <Sections.Section>
            <Sections.GenericItem>
              <View style={styles.summaryItem}>
                <ThemeIcon style={styles.summaryIcon} svg={SvgProfile} />
                <ThemeText>
                  {createTravellersText(
                    userCountState.userProfilesWithCount,
                    t,
                    language,
                  )}
                </ThemeText>
              </View>
            </Sections.GenericItem>
          </Sections.Section>
        </View>

        {travellerSelectionMode === 'multiple' ? (
          <MultipleTravellersSelection {...userCountState} />
        ) : (
          <SingleTravellerSelection {...userCountState} />
        )}
      </ScrollView>

      <View
        style={[
          styles.saveButton,
          {
            paddingBottom: Math.max(safeAreBottom, theme.spacings.medium),
          },
        ]}
      >
        <Button
          color="primary_2"
          text={t(TravellersTexts.primaryButton.text)}
          accessibilityHint={t(TravellersTexts.primaryButton.a11yHint)}
          disabled={!userCountState.userProfilesWithCount.some((u) => u.count)}
          onPress={() => {
            navigation.navigate('PurchaseOverview', {
              userProfilesWithCount: userCountState.userProfilesWithCount,
            });
          }}
        />
      </View>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.background.level2,
  },
  travellerCounters: {
    margin: theme.spacings.medium,
  },
  summarySection: {
    marginBottom: theme.spacings.medium,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryIcon: {
    marginRight: theme.spacings.medium,
  },
  saveButton: {
    marginHorizontal: theme.spacings.medium,
  },
}));

export default Travellers;
