import {StyleSheet, Theme} from '@atb/theme';
import {TravelTokenTexts, useTranslation} from '@atb/translations';
import {TravelTokenBox} from '@atb/travel-token-box';
import React from 'react';
import {View} from 'react-native';
import {FaqSection} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_ProfileStack/Profile_TravelTokenScreen/FaqSection';
import {useTokenToggleDetailsQuery} from '@atb/modules/mobile-token';
import {useRemoteConfigContext} from '@atb/modules/remote-config';
import {Section, GenericSectionItem} from '@atb/components/sections';
import {TokenToggleInfo} from '@atb/screen-components/select-travel-token-screen';
import {FullScreenView} from '@atb/components/screen-view';
import {ScreenHeading} from '@atb/components/heading';
import {ProfileScreenProps} from '../navigation-types';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {useIsFocused} from '@react-navigation/native';

type Props = ProfileScreenProps<'Profile_TravelTokenScreen'>;

export const Profile_TravelTokenScreen = ({navigation}: Props) => {
  const focusRef = useFocusOnLoad(navigation);
  const isFocused = useIsFocused();
  const styles = useStyles();
  const {t} = useTranslation();
  const {disable_travelcard} = useRemoteConfigContext();
  const {data, isLoading} = useTokenToggleDetailsQuery(isFocused);
  const toggleLimit = data?.toggleLimit ?? 0;

  const title = disable_travelcard
    ? t(TravelTokenTexts.travelToken.header.titleWithoutTravelcard)
    : t(TravelTokenTexts.travelToken.header.title);

  const onPressChangeButton = () =>
    navigation.navigate('Root_SelectTravelTokenScreen');

  return (
    <FullScreenView
      focusRef={focusRef}
      headerProps={{
        title,
        leftButton: {type: 'back'},
      }}
      parallaxContent={(focusRef) => (
        <ScreenHeading ref={focusRef} text={title} />
      )}
    >
      <View style={styles.content}>
        <TravelTokenBox
          showIfThisDevice={true}
          alwaysShowErrors={true}
          onPressChangeButton={onPressChangeButton}
        />
        <Section>
          {data?.toggleLimit !== undefined && (
            <GenericSectionItem>
              <TokenToggleInfo
                toggleLimit={toggleLimit}
                isLoading={isLoading}
              />
            </GenericSectionItem>
          )}
        </Section>
        <FaqSection toggleMaxLimit={data?.maxToggleLimit} />
      </View>
    </FullScreenView>
  );
};

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  content: {
    rowGap: theme.spacing.medium,
    padding: theme.spacing.medium,
  },
}));
