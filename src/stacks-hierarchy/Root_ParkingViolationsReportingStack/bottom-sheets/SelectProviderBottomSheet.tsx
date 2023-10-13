import {ViolationsReportingProvider} from '@atb/api/types/mobility';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {Button} from '@atb/components/button';
import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
import {ThemeText} from '@atb/components/text';
import {StyleSheet, useTheme} from '@atb/theme';
import {ScreenHeaderTexts, useTranslation} from '@atb/translations';
import {ParkingViolationTexts} from '@atb/translations/screens/ParkingViolations';
import {useState} from 'react';
import {ScrollView, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ProviderLogo} from '@atb/stacks-hierarchy/Root_ParkingViolationsReportingStack/components/ProviderLogo';
import {SelectGroup} from '@atb/stacks-hierarchy/Root_ParkingViolationsReportingStack/components/SelectGroup';

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
  const {theme} = useTheme();
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
            renderItem={(provider, isSeleted) => (
              <>
                <ProviderLogo
                  style={[
                    styles.providerLogo,
                    {
                      borderColor: isSeleted
                        ? theme.interactive.interactive_0.default.background
                        : theme.static.background.background_0.background,
                    },
                  ]}
                  provider={provider}
                />
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
      borderWidth: 2,
      marginRight: theme.spacings.medium,
    },
    footer: {
      marginTop: theme.spacings.medium,
      marginBottom: Math.max(bottom, theme.spacings.medium),
    },
  };
});
