import {useTranslation} from '@atb/translations';
import {ParkingViolationTexts} from '@atb/translations/screens/ParkingViolations';
import {ScreenContainer} from './ScreenContainer';
import {ParkingViolationsScreenProps} from './navigation-types';
import {Button} from '@atb/components/button';
import {useParkingViolationsState} from './ParkingViolationsContext';
import {StyleSheet, useTheme} from '@atb/theme';
import {Image, View, TouchableOpacity} from 'react-native';
import {isDefined} from '@atb/utils/presence';
import chunk from 'lodash/chunk';
import {useState} from 'react';
import {themeColor} from './Root_ParkingViolationsReportingStack';

export type ProvidersScreenProps =
  ParkingViolationsScreenProps<'ParkingViolations_Providers'>;

export const ParkingViolations_Providers = ({
  navigation,
}: ProvidersScreenProps) => {
  const {t} = useTranslation();
  const style = useStyles();
  const {theme} = useTheme();
  const {providers} = useParkingViolationsState();
  const [selectedProvider, setSelectedProvider] = useState<number>();

  return (
    <ScreenContainer
      title={t(ParkingViolationTexts.operator.title)}
      buttons={
        <Button
          interactiveColor="interactive_0"
          onPress={() => navigation.navigate('ParkingViolations_Summary')}
          text={t(ParkingViolationTexts.operator.nextButton)}
          testID="nextButton"
          accessibilityHint={''} //TODO
        />
      }
    >
      <>
        {chunk(providers, 4).map((providerRow) => (
          <View
            style={style.providerRow}
            key={providerRow.reduce((val, p) => val + (p?.id ?? 1), 0)}
          >
            {providerRow.filter(isDefined).map((provider) => (
              <TouchableOpacity
                key={provider.id}
                style={{
                  ...style.providerLogo,
                  borderColor:
                    selectedProvider === provider.id
                      ? theme.static.status['valid'].background
                      : theme.static.background[themeColor].background,
                }}
                onPress={() => setSelectedProvider(provider.id)}
              >
                <Image
                  height={80}
                  width={80}
                  source={{
                    uri: `data:image/png;base64,${provider.image.base64}`,
                  }}
                />
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </>
    </ScreenContainer>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  providerRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: theme.spacings.medium,
  },
  providerLogo: {
    borderRadius: 40,
    overflow: 'hidden',
    borderWidth: 2,
  },
}));
