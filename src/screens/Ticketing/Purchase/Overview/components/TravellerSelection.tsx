import React, {useEffect} from 'react';
import ThemeText from '@atb/components/text';
import {StyleProp, View, ViewStyle} from 'react-native';
import {StyleSheet} from '@atb/theme';
import useUserCountState, {
  UserProfileWithCount,
} from '../../Travellers/use-user-count-state';
import {PreassignedFareProduct} from '@atb/reference-data/types';
import SingleTravellerSelection from '../../Travellers/SingleTravellerSelection';
import {getPurchaseFlow} from '../../utils';
import MultipleTravellersSelection from '../../Travellers/MultipleTravellersSelection';
import {
  DEFAULT_LANGUAGE,
  LanguageSettingsTexts,
  PurchaseOverviewTexts,
  useTranslation,
} from '@atb/translations';
import {ActionItem} from '@atb/components/sections';
import FixedSwitch from '@atb/components/switch';
import InternalLabeledItem from '@atb/components/sections/internals/internal-labeled-item';
import {usePreferences} from '@atb/preferences';

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
            {t(PurchaseOverviewTexts.travellerSelection.title)}
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
          <View></View>
          <ThemeText type="body__secondary">{'Vis info'}</ThemeText>
          <FixedSwitch
            style={{
              alignSelf: 'flex-start',
              transform: [{scale: 0.8}, {translateY: -3}],
            }}
            value={!hideTravellerDescriptions}
            onValueChange={(checked) => {
              setPreference({hideTravellerDescriptions: !checked});
            }}
            accessibilityLabel={'a11y'}
          />
        </View>
      </View>
      {travellerSelectionMode === 'multiple' ? (
        <MultipleTravellersSelection
          {...userCountState}
          userProfilesWithCount={selectableUserProfilesWithCount}
        />
      ) : (
        <SingleTravellerSelection
          {...userCountState}
          userProfilesWithCount={selectableUserProfilesWithCount}
        />
      )}
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  title: {
    marginBottom: theme.spacings.medium,
  },
}));
