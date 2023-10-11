import {ViolationsReportingProvider} from '@atb/api/types/mobility';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {ScreenHeaderTexts, useTranslation} from '@atb/translations';
import {Image, ScrollView, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {SelectGroup} from './SelectGroup';
import {Button} from '@atb/components/button';
import {useState} from 'react';
import {ParkingViolationTexts} from '@atb/translations/screens/ParkingViolations';

const ICON_SIZE = 50;

type Props = {
  providers: ViolationsReportingProvider[];
  close: () => void;
  onSelect: (provider: ViolationsReportingProvider) => void;
};

export const SelectProviderBottomSheet = ({
  providers,
  close,
  onSelect,
}: Props) => {
  const {t} = useTranslation();
  const styles = useStyles();
  const [selectedProvider, setSelectedProvider] =
    useState<ViolationsReportingProvider>();

  return (
    <BottomSheetContainer>
      <ScreenHeaderWithoutNavigation
        leftButton={{
          type: 'close',
          onPress: close,
          text: t(ScreenHeaderTexts.headerButton.close.text),
        }}
        color={'background_1'}
        setFocusOnLoad={false}
        title={t(ParkingViolationTexts.selectProvider.title)}
      />
      <>
        <ThemeText style={styles.content}>
          Hvis QR-koden ikke er mulig å skanne kan du oppgi utleiefirmaet
          manuelt.
        </ThemeText>
        <ScrollView style={styles.providerList}>
          <SelectGroup
            style={styles.content}
            items={providers}
            onSelect={(providers) => setSelectedProvider(providers[0])}
            keyExtractor={(provider) => 'provider' + provider.id}
            generateAccessibilityLabel={(provider) => provider.name}
            renderItem={(provider) => (
              <>
                <View style={styles.providerLogo}>
                  <Image
                    height={ICON_SIZE}
                    width={ICON_SIZE}
                    source={{
                      uri: `data:image/png;base64,${provider.image.base64}`,
                    }}
                  />
                </View>
                <ThemeText>{provider.name}</ThemeText>
              </>
            )}
          />
        </ScrollView>
        <View style={[styles.content, styles.footer]}>
          <Button
            text={t(ParkingViolationTexts.selectProvider.confirm)}
            onPress={() =>
              selectedProvider ? onSelect(selectedProvider) : undefined
            }
            disabled={!selectedProvider}
          />
        </View>
      </>
    </BottomSheetContainer>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  const {bottom} = useSafeAreaInsets();
  return {
    content: {
      marginHorizontal: theme.spacings.medium,
    },
    providerList: {
      marginTop: theme.spacings.medium,
      flexGrow: 1,
    },
    providerLogo: {
      borderRadius: ICON_SIZE / 2,
      overflow: 'hidden',
      borderWidth: 2,
      marginRight: theme.spacings.medium,
    },
    footer: {
      marginTop: theme.spacings.medium,
      marginBottom: Math.max(bottom, theme.spacings.medium),
    },
  };
});
