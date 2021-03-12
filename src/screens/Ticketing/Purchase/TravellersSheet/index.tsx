import SvgProfile from '@atb/assets/svg/icons/tab-bar/Profile';
import Button from '@atb/components/button';
import Header from '@atb/components/screen-header';
import * as Sections from '@atb/components/sections';
import ThemeText from '@atb/components/text';
import ThemeIcon from '@atb/components/theme-icon';
import {StyleSheet} from '@atb/theme';
import {TravellersTexts, useTranslation} from '@atb/translations';
import React, {RefObject} from 'react';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {createTravellersText} from '../Overview';
import SingleTravellerSelection from './SingleTravellerSelection';
import MultipleTravellersSelection from './MultipleTravellersSelection';
import useUserCountState, {UserProfileWithCount} from './use-user-count-state';
import {getPurchaseFlow} from '@atb/screens/Ticketing/Purchase/utils';
import {PreassignedFareProduct} from '@atb/reference-data/types';

type Props = {
  preassignedFareProduct: PreassignedFareProduct;
  userProfilesWithCount: UserProfileWithCount[];
  save: (userProfilesWithCount: UserProfileWithCount[]) => void;
  close: () => void;
  focusRef: RefObject<any>;
};

const TravellersSheet = ({
  preassignedFareProduct,
  userProfilesWithCount,
  save,
  close,
  focusRef,
}: Props) => {
  const styles = useStyles();
  const {t, language} = useTranslation();
  const {travellerSelectionMode} = getPurchaseFlow(preassignedFareProduct);

  const userCountState = useUserCountState(userProfilesWithCount);

  return (
    <>
      <Header
        title={t(TravellersTexts.header.title)}
        leftButton={{type: 'cancel', onPress: close}}
      />

      <ScrollView style={styles.travellerCounters}>
        <View style={styles.summarySection} ref={focusRef}>
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

      <View style={styles.saveButton}>
        <Button
          color="primary_2"
          text={t(TravellersTexts.primaryButton.text)}
          accessibilityHint={t(TravellersTexts.primaryButton.a11yHint)}
          disabled={!userCountState.userProfilesWithCount.some((u) => u.count)}
          onPress={() => {
            save(userCountState.userProfilesWithCount);
            close();
          }}
        />
      </View>
    </>
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

export default TravellersSheet;
