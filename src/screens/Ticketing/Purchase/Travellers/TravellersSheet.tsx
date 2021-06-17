import SvgProfile from '@atb/assets/svg/icons/tab-bar/Profile';
import Button from '@atb/components/button';
import * as Sections from '@atb/components/sections';
import ThemeText from '@atb/components/text';
import ThemeIcon from '@atb/components/theme-icon';
import {StyleSheet} from '@atb/theme';
import {TravellersTexts, useTranslation} from '@atb/translations';
import React, {forwardRef} from 'react';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {createTravellersText} from '../Overview';
import SingleTravellerSelection from './SingleTravellerSelection';
import MultipleTravellersSelection from './MultipleTravellersSelection';
import useUserCountState, {UserProfileWithCount} from './use-user-count-state';
import {getPurchaseFlow} from '@atb/screens/Ticketing/Purchase/utils';
import FullScreenFooter from '@atb/components/screen-footer/full-footer';
import {PreassignedFareProduct} from '@atb/reference-data/types';
import ScreenHeader from '@atb/components/screen-header';
import {BottomSheetContainer} from '@atb/components/bottom-sheet/use-bottom-sheet';

type Props = {
  preassignedFareProduct: PreassignedFareProduct;
  userProfilesWithCount: UserProfileWithCount[];
  close: () => void;
  save: (userProfilesWithCount: UserProfileWithCount[]) => void;
};

const TravellersSheet = forwardRef<ScrollView, Props>(
  ({preassignedFareProduct, userProfilesWithCount, close, save}, focusRef) => {
    const styles = useStyles();
    const {t, language} = useTranslation();
    const {travellerSelectionMode} = getPurchaseFlow(preassignedFareProduct);

    const userCountState = useUserCountState(userProfilesWithCount);

    return (
      <BottomSheetContainer>
        <ScreenHeader
          title={t(TravellersTexts.header.title)}
          leftButton={{type: 'cancel', onPress: close}}
          color={'background_2'}
        />

        <ScrollView style={styles.travellerCounters}>
          <View
            style={styles.summarySection}
            accessible={true}
            accessibilityLabel={createTravellersText(
              userCountState.userProfilesWithCount,
              false,
              true,
              t,
              language,
            )}
          >
            <Sections.Section>
              <Sections.GenericItem>
                <View style={styles.summaryItem}>
                  <ThemeIcon style={styles.summaryIcon} svg={SvgProfile} />
                  <ThemeText>
                    {createTravellersText(
                      userCountState.userProfilesWithCount,
                      true,
                      false,
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

        <FullScreenFooter>
          <Button
            color="primary_2"
            text={t(TravellersTexts.primaryButton.text)}
            accessibilityHint={t(TravellersTexts.primaryButton.a11yHint)}
            disabled={
              !userCountState.userProfilesWithCount.some((u) => u.count)
            }
            onPress={() => {
              save(userCountState.userProfilesWithCount);
              close();
            }}
          />
        </FullScreenFooter>
      </BottomSheetContainer>
    );
  },
);

const useStyles = StyleSheet.createThemeHook((theme) => {
  return {
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
  };
});

export default TravellersSheet;
