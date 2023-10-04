import {ViolationsReportingProvider} from '@atb/api/types/mobility';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {ScreenHeaderTexts, useTranslation} from '@atb/translations';
import {Image, ScrollView, TouchableOpacity} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

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
        title="Velg leverandør"
      />
      <ScrollView contentContainerStyle={styles.container}>
        <ThemeText>
          Hvis QR-koden ikke er mulig å skanne kan du oppgi utleiefirmaet
          manuelt.
        </ThemeText>
        {providers.map((provider) => (
          <TouchableOpacity
            key={provider.id}
            style={{
              ...styles.providerLogo,
            }}
            onPress={() => onSelect(provider)}
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
      </ScrollView>
    </BottomSheetContainer>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  const {bottom} = useSafeAreaInsets();
  return {
    container: {
      flexGrow: 1,
      flexShrink: 0,
      marginBottom: Math.max(bottom, theme.spacings.medium),
      marginHorizontal: theme.spacings.medium,
    },
    providerLogo: {
      borderRadius: 40,
      overflow: 'hidden',
      borderWidth: 2,
    },
  };
});
