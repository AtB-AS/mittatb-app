import {usePreferences} from '@atb/preferences';
import {StyleSheet, Theme, useTheme} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import React, {useState} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {TouchableOpacity} from 'react-native';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import ThemeText from '@atb/components/text';
import {View} from 'react-native';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import {CompositeNavigationProp} from '@react-navigation/native';
import {RootStackParamList} from '@atb/navigation';
import {StackNavigationProp} from '@react-navigation/stack';
import {ProfileStackParams} from '..';
import Button from '@atb/components/button';
import RadioIcon from '@atb/components/radio-icon/radio-icon';
import {Confirm} from '@atb/assets/svg/icons/actions';
import * as Sections from '@atb/components/sections';
import RadioItem from '@atb/components/radio-icon/radio-item';
import deviceInfoModule from 'react-native-device-info';

export type SelectTravelCardNavigationProp = StackNavigationProp<
  ProfileStackParams,
  'SelectTravelCard'
>;

type SelectTravelCardScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<RootStackParamList>,
  SelectTravelCardNavigationProp
>;

type SelectTravelCardScreenProps = {
  navigation: SelectTravelCardScreenNavigationProp;
};

type itemType = {
  key: number;
  text: string;
};

const items: [itemType] = [{key: 1, text: 'test'}];

export default function SelectTravelCard({
  navigation,
}: SelectTravelCardScreenProps) {
  const styles = useStyles();
  const {t, language} = useTranslation();
  const [checked, setChecked] = useState(false);
  const {theme} = useTheme();

  const [selectedDevice, setSelectedDevice] = useState(0);
  const [devicename, setdevicename] = useState('');

  if (!devicename) {
    updateDevName();
  }

  async function updateDevName() {
    let s = '';
    s += (await deviceInfoModule.getDeviceName()) + ' ';
    s +=
      '(' +
      (await deviceInfoModule.getManufacturer()) +
      ' ' +
      deviceInfoModule.getModel() +
      ', ' +
      deviceInfoModule.getSystemName() +
      ')';
    setdevicename(s);
  }

  const availableDevices = [
    {
      id: 0,
      modelName: devicename,
      addedDate: '14.09.2021',
    },
    {
      id: 1,
      modelName: 'Samsung Galaxy S21',
      addedDate: '23.10.2021',
    },
  ];

  return (
    <View style={styles.container}>
      <FullScreenHeader
        title="Mitt reisebevis"
        leftButton={{type: 'back'}}
        color={'background_gray'}
      />
      <ScrollView style={styles.scrollView}>
        <View style={styles.radioArea}>
          <TouchableOpacity
            style={[
              styles.activeTravelCard,
              styles.leftItem,
              {
                backgroundColor: checked
                  ? theme.colors.primary_2.backgroundColor
                  : theme.colors.background_0.backgroundColor,
              },
            ]}
            onPress={() => setChecked(true)}
            accessibilityHint={
              'Activate to select t:card as active travel card.'
            }
            accessibilityRole={'radio'}
            accessibilityState={{selected: checked}}
          >
            <ThemeText
              type="heading__title"
              color={checked ? 'primary_2' : undefined}
              style={[styles.activeTicketType, styles.centerText]}
            >
              T:kort
            </ThemeText>
            <ThemeText
              type="body__secondary"
              style={styles.centerText}
              color={checked ? 'primary_2' : undefined}
            >
              Valider kortet ditt på holdeplass eller ombord. Kortet leses av
              ved kontroll.
            </ThemeText>
            <View style={styles.radio}>
              <RadioIcon
                checked={checked}
                color={checked ? 'primary_2' : undefined}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.activeTravelCard,
              styles.rightItem,
              {
                backgroundColor: !checked
                  ? theme.colors.primary_2.backgroundColor
                  : theme.colors.background_0.backgroundColor,
              },
            ]}
            onPress={() => setChecked(false)}
            accessibilityHint={
              'Activate to select mobile phone as active travel card.'
            }
            accessibilityRole={'radio'}
            accessibilityState={{selected: !checked}}
          >
            <ThemeText
              type="heading__paragraph"
              color={!checked ? 'primary_2' : undefined}
              style={[styles.activeTicketType, styles.centerText]}
            >
              Mobil
            </ThemeText>
            <ThemeText
              type="body__secondary"
              style={styles.centerText}
              color={!checked ? 'primary_2' : undefined}
            >
              Gå ombord med mobilen. Mobilen vises frem ved kontroll.
            </ThemeText>
            <View style={styles.radio}>
              <RadioIcon
                checked={!checked}
                color={!checked ? 'primary_2' : undefined}
              />
            </View>
          </TouchableOpacity>
        </View>

        {!checked && (
          <View style={styles.deviceSection}>
            <Sections.Section>
              <Sections.GenericItem>
                <ThemeText type="heading__title">
                  Hvilken enhet vil du bruke?
                </ThemeText>
                <ThemeText type="body__tertiary">
                  Du kan ha én aktiv enhet
                </ThemeText>
              </Sections.GenericItem>
              <Sections.GenericItem>
                <ThemeText type="body__tertiary">Velg enhet</ThemeText>
                {availableDevices.map((device) => (
                  <RadioItem
                    key={device.id}
                    checked={selectedDevice == device.id}
                    text={device.modelName}
                    subText={'Lagt til ' + device.addedDate}
                    onPress={() => setSelectedDevice(device.id)}
                    accessibilityHint={
                      'Select to set this mobile phone as active travel card.'
                    }
                  ></RadioItem>
                ))}
              </Sections.GenericItem>
            </Sections.Section>
          </View>
        )}
        <Button
          onPress={() => {
            navigation.goBack();
          }}
          text="Lagre valg"
          color="primary_2"
          icon={Confirm}
          iconPosition="right"
          style={styles.submitButton}
        ></Button>
      </ScrollView>
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    backgroundColor: theme.colors.background_gray.backgroundColor,
    flex: 1,
  },
  scrollView: {
    paddingHorizontal: theme.spacings.large,
  },
  sectionWithPadding: {
    marginVertical: theme.spacings.xLarge,
  },
  centerText: {
    textAlign: 'center',
  },
  radioArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacings.xLarge,
    alignContent: 'center',
  },
  activeTravelCard: {
    flex: 1,
    padding: theme.spacings.xLarge,
    borderRadius: theme.border.radius.regular,
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  rightItem: {
    marginLeft: theme.spacings.xLarge / 2,
  },
  leftItem: {
    marginRight: theme.spacings.xLarge / 2,
  },
  activeTicketHeader: {
    marginBottom: theme.spacings.medium,
  },
  activeTicketType: {
    marginBottom: theme.spacings.large,
  },
  deviceSection: {
    marginTop: theme.spacings.xLarge,
  },
  radio: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: theme.spacings.large,
  },
  submitButton: {
    marginVertical: theme.spacings.xLarge,
  },
}));
