import React from 'react';
import {View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {TicketingStackParams} from '../';
import Header from '../../../../components/screen-header';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {StyleSheet, useTheme} from '../../../../theme';
import useUserCountState from './use-user-count-state';
import {DismissableStackNavigationProp} from '../../../../navigation/createDismissableStackNavigator';
import * as Sections from '../../../../components/sections';
import {ScrollView} from 'react-native-gesture-handler';
import {TravellersTexts, useTranslation} from '../../../../translations';
import Button from '../../../../components/button';
import {getReferenceDataName} from '../../../../reference-data/utils';

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

  const {userProfilesWithCount, addCount, removeCount} = useUserCountState(
    params.userProfilesWithCount,
  );

  const {top: safeAreaTop, bottom: safeAreBottom} = useSafeAreaInsets();

  return (
    <View style={[styles.container, {paddingTop: safeAreaTop}]}>
      <Header
        title={t(TravellersTexts.header.title)}
        leftButton={{type: 'back'}}
      />

      <ScrollView style={styles.travellerCounters}>
        <Sections.Section>
          {userProfilesWithCount.map((u) => (
            <Sections.CounterInput
              key={u.userTypeString}
              text={getReferenceDataName(u, language)}
              count={u.count}
              addCount={() => addCount(u.userTypeString)}
              removeCount={() => removeCount(u.userTypeString)}
            />
          ))}
        </Sections.Section>
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
          mode="primary"
          text={t(TravellersTexts.primaryButton.text)}
          accessibilityHint={t(TravellersTexts.primaryButton.a11yHint)}
          disabled={!userProfilesWithCount.some((u) => u.count)}
          onPress={() => {
            navigation.navigate('PurchaseOverview', {
              userProfilesWithCount,
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
  saveButton: {
    marginHorizontal: theme.spacings.medium,
  },
}));

export default Travellers;
