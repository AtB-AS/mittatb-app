import FullScreenHeader from '@atb/components/screen-header/full-header';
import {StyleSheet} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import React, {useState} from 'react';
import {ScrollView, View} from 'react-native';
import ThemeText from '@atb/components/text';
import {LeftButtonProps, RightButtonProps} from '@atb/components/screen-header';
import useFocusOnLoad from '@atb/utils/use-focus-on-load';
import {ThemeColor} from '@atb/theme/colors';
import {useNavigation} from '@react-navigation/native';
import Button from '@atb/components/button';
import * as Sections from '@atb/components/sections';
import RadioItem from '@atb/components/radio-icon/radio-item';

const themeColor: ThemeColor = 'background_gray';

export default function AssignPhone({
  headerLeftButton,
  headerRightButton,
  currentDeviceId,
}: {
  headerLeftButton?: LeftButtonProps;
  headerRightButton?: RightButtonProps;
  currentDeviceId: number;
}) {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const styles = useThemeStyles();
  const focusRef = useFocusOnLoad();

  const availableDevices = [
    {
      id: 0,
      modelName: 'iPhone 13 Pro',
      addedDate: '10. okt, kl. 09:10',
    },
    {
      id: 1,
      modelName: 'Samsung Galaxy S21',
      addedDate: '10. okt, kl. 09:10',
    },
  ];

  const [selectedDevice, setSelectedDevice] = useState(
    availableDevices[currentDeviceId || 0],
  );

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
            Velg ditt reisebevis
          </ThemeText>
          <View>
            <ThemeText style={styles.description} color={themeColor}>
              Vi fant flere tilgjengelige mobilenheter
            </ThemeText>
          </View>
        </View>
        <View style={styles.deviceSelection}>
          <Sections.GenericItem>
            <ThemeText type="body__tertiary">Velg enhet</ThemeText>
            {selectedDevice &&
              availableDevices.map((device) => (
                <RadioItem
                  key={device.id}
                  checked={selectedDevice.id === device.id}
                  text={device.modelName}
                  subText={'Lagt til ' + device.addedDate}
                  onPress={() => setSelectedDevice(device)}
                  accessibilityHint={
                    'Select to set this mobile phone as active travel card.'
                  }
                ></RadioItem>
              ))}
          </Sections.GenericItem>
        </View>

        <Button
          color={'primary_2'}
          style={styles.marginVertical}
          onPress={() => {
            navigation.navigate('AssignTravelTokenInApp', {
              selectedDeviceId: selectedDevice.id,
            });
          }}
          text={'OK'}
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
  deviceSelection: {
    borderRadius: theme.border.radius.regular,
    padding: theme.spacings.medium,
    backgroundColor: theme.colors.background_0.backgroundColor,
    marginVertical: theme.spacings.xLarge,
  },
}));
