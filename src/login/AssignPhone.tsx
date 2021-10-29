import FullScreenHeader from '@atb/components/screen-header/full-header';
import {StyleSheet} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import React from 'react';
import {ScrollView, View} from 'react-native';
import ThemeText from '@atb/components/text';
import {LeftButtonProps, RightButtonProps} from '@atb/components/screen-header';
import useFocusOnLoad from '@atb/utils/use-focus-on-load';
import {ThemeColor} from '@atb/theme/colors';
import {useNavigation} from '@react-navigation/native';
import {useTicketState} from '@atb/tickets';
import Button from '@atb/components/button';

const themeColor: ThemeColor = 'background_gray';

export default function AssignPhone({
  headerLeftButton,
  headerRightButton,
}: {
  headerLeftButton?: LeftButtonProps;
  headerRightButton?: RightButtonProps;
}) {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const styles = useThemeStyles();
  const focusRef = useFocusOnLoad();

  const {customerProfile} = useTicketState();
  const hasTravelCard = !customerProfile?.travelcard;

  return (
    <View style={styles.container}>
      <FullScreenHeader
        leftButton={headerLeftButton}
        rightButton={headerRightButton}
        setFocusOnLoad={false}
        color={themeColor}
      />

      <ScrollView centerContent={true} contentContainerStyle={styles.mainView}>
        <View accessible={true} accessibilityRole="header" ref={focusRef}>
          <ThemeText
            type={'body__primary--jumbo--bold'}
            style={[styles.alignCenter, styles.marginVertical]}
            color={themeColor}
          >
            {hasTravelCard
              ? 'Ditt t:kort er satt som reisebevis'
              : 'Din mobil er satt som reisebevis'}
          </ThemeText>
        </View>
        <Button
          mode="secondary"
          style={styles.marginVertical}
          color="primary_2"
          onPress={() => {
            navigation.navigate('AssignTravelTokenInApp', {selectedDevice: 1});
          }}
          text={'Velg en annen mobil'}
        />
      </ScrollView>
    </View>
  );
}

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.colors[themeColor].backgroundColor,
    flex: 1,
  },
  mainView: {
    padding: theme.spacings.large,
  },
  alignCenter: {
    textAlign: 'center',
  },
  marginVertical: {
    marginBottom: theme.spacings.medium,
  },
  description: {
    marginVertical: theme.spacings.large,
    textAlign: 'center',
  },
  tcardContainer: {
    marginTop: theme.spacings.xLarge,
    marginBottom: theme.spacings.xLarge * 3,
    alignSelf: 'center',
  },
  phoneInfoBox: {
    marginVertical: theme.spacings.xLarge,
    alignSelf: 'center',
    backgroundColor: theme.colors.background_3.backgroundColor,
    padding: theme.spacings.xLarge,
    borderRadius: theme.border.radius.circle,
    minHeight: 300,
    minWidth: 200,
  },
  phoneLine: {
    width: theme.spacings.xLarge * 2,
    borderRadius: theme.border.radius.regular,
    height: theme.spacings.small,
    backgroundColor: theme.colors.secondary_2.backgroundColor,
    alignSelf: 'center',
    marginTop: theme.spacings.small,
    marginBottom: theme.spacings.small + theme.spacings.xLarge,
  },
  phoneInfoBoxInner: {
    backgroundColor: theme.colors.background_1.backgroundColor,
    borderRadius: theme.border.radius.regular,
    padding: theme.spacings.medium,
    alignSelf: 'center',
  },
  phoneInfoBoxTitle: {
    marginBottom: theme.spacings.medium,
    textAlign: 'center',
  },
}));
