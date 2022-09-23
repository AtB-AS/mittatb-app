import React, {useEffect} from 'react';
import ThemeText from '@atb/components/text';
import {Platform, StyleProp, View, ViewStyle} from 'react-native';
import {StyleSheet} from '@atb/theme';
import useUserCountState, {
  UserProfileWithCount,
} from '../../Travellers/use-user-count-state';
import {PreassignedFareProduct} from '@atb/reference-data/types';
import SingleTravellerSelection from '../../Travellers/SingleTravellerSelection';
import {getPurchaseFlow} from '../../utils';
import MultipleTravellersSelection from '../../Travellers/MultipleTravellersSelection';
import {PurchaseOverviewTexts, useTranslation} from '@atb/translations';
import FixedSwitch from '@atb/components/switch';
import {usePreferences} from '@atb/preferences';
import useFontScale from '@atb/utils/use-font-scale';

type TravellerSelectionProps = {
  selectableUserProfiles: UserProfileWithCount[];
  setTravellerSelection: (
    userProfilesWithCount: UserProfileWithCount[],
  ) => void;
  style?: StyleProp<ViewStyle>;
  preassignedFareProduct: PreassignedFareProduct;
};

export default function TravellerSelection({
  setTravellerSelection,
  style,
  selectableUserProfiles,
  preassignedFareProduct,
}: TravellerSelectionProps) {
  const styles = useStyles();
  const {t} = useTranslation();
  const {travellerSelectionMode} = getPurchaseFlow(preassignedFareProduct);
  const userCountState = useUserCountState(selectableUserProfiles);
  const selectableUserProfilesWithCount =
    userCountState.userProfilesWithCount.filter((a) =>
      selectableUserProfiles.some((b) => a.id === b.id),
    );
  const {
    setPreference,
    preferences: {hideTravellerDescriptions},
  } = usePreferences();

  useEffect(() => {
    const filteredSelection = userCountState.userProfilesWithCount.filter((u) =>
      selectableUserProfiles.find((i) => i.id === u.id),
    );
    setTravellerSelection(filteredSelection);
  }, [userCountState.userProfilesWithCount, preassignedFareProduct]);

  useEffect(() => {
    userCountState.updateSelectable(selectableUserProfiles);
  }, [selectableUserProfiles]);

  return (
    <View style={style}>
      <View
        style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}
      >
        <View style={{flexGrow: 1}}>
          <ThemeText
            type="body__secondary"
            color="secondary"
            style={styles.title}
          >
            {travellerSelectionMode == 'multiple'
              ? t(PurchaseOverviewTexts.travellerSelection.title_multiple)
              : t(PurchaseOverviewTexts.travellerSelection.title_single)}
          </ThemeText>
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            flexGrow: 1,
            justifyContent: 'flex-end',
          }}
        >
          <ThemeText
            type="body__secondary"
            accessible={false}
            importantForAccessibility="no"
          >
            {t(PurchaseOverviewTexts.travellerSelection.infoToggle)}
          </ThemeText>
          <FixedSwitch
            style={[
              styles.toggle,
              Platform.OS === 'android'
                ? styles.androidToggle
                : styles.iosToggle,
            ]}
            value={!hideTravellerDescriptions}
            onValueChange={(checked) => {
              setPreference({hideTravellerDescriptions: !checked});
            }}
            accessibilityLabel={t(
              PurchaseOverviewTexts.travellerSelection.infoToggleA11y,
            )}
          />
        </View>
      </View>
      {travellerSelectionMode === 'multiple' ? (
        <MultipleTravellersSelection
          ticketType={preassignedFareProduct.type}
          {...userCountState}
          userProfilesWithCount={selectableUserProfilesWithCount}
        />
      ) : (
        <SingleTravellerSelection
          ticketType={preassignedFareProduct.type}
          {...userCountState}
          userProfilesWithCount={selectableUserProfilesWithCount}
        />
      )}
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => {
  const scale = useFontScale();
  return {
    title: {
      marginBottom: theme.spacings.medium,
    },
    toggle: {
      alignSelf: 'center',
    },
    androidToggle: {
      transform: [{scale: scale}, {translateY: -6}],
    },
    iosToggle: {
      marginLeft: theme.spacings.xSmall,
      transform: [{scale: 0.7 * scale}, {translateY: -10}],
    },
  };
});
