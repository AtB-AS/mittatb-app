import {ViolationsReportingProvider} from '@atb/api/types/mobility';
import {Button} from '@atb/components/button';
import {ThemeText} from '@atb/components/text';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {dictionary, useTranslation} from '@atb/translations';
import {ParkingViolationTexts} from '@atb/translations/screens/ParkingViolations';
import {useState} from 'react';
import {ScrollView, View} from 'react-native';
import {ProviderLogo} from '../components/ProviderLogo';
import {SelectGroup} from '../components/SelectGroup';
import {BottomSheetModal} from '@atb/components/bottom-sheet-v2';
import {Close} from '@atb/assets/svg/mono-icons/actions';
import {giveFocus} from '@atb/utils/use-focus-on-load';
import {BottomSheetModal as GorhomBottomSheetModal} from '@gorhom/bottom-sheet';

type Props = {
  providers: ViolationsReportingProvider[];
  onClose: () => void;
  onSelect: (provider: ViolationsReportingProvider) => void;
  qrScanFailed: boolean | undefined;
  onCloseFocusRef: React.RefObject<View | null>;
  bottomSheetModalRef: React.RefObject<GorhomBottomSheetModal | null>;
};

export const SelectProviderBottomSheet = ({
  providers,
  onClose,
  onSelect,
  qrScanFailed,
  onCloseFocusRef,
  bottomSheetModalRef,
}: Props) => {
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const styles = useStyles();
  const [selectedProvider, setSelectedProvider] =
    useState<ViolationsReportingProvider>();

  return (
    <BottomSheetModal
      bottomSheetModalRef={bottomSheetModalRef}
      heading={t(ParkingViolationTexts.selectProvider.title)}
      rightIconText={t(dictionary.appNavigation.close.text)}
      rightIcon={Close}
      closeCallback={() => {
        giveFocus(onCloseFocusRef);
        onClose();
      }}
    >
      <>
        <ThemeText style={styles.content}>
          {qrScanFailed
            ? t(ParkingViolationTexts.selectProvider.qrFailedDescription)
            : t(ParkingViolationTexts.selectProvider.description)}
        </ThemeText>
        <ScrollView style={styles.providerList}>
          <SelectGroup
            mode="radio"
            style={styles.content}
            items={providers}
            onSelect={setSelectedProvider}
            keyExtractor={(provider) => 'provider' + provider.id}
            generateAccessibilityLabel={(provider) => provider.name}
            renderItem={(provider, isSeleted) => (
              <>
                <ProviderLogo
                  style={[
                    styles.providerLogo,
                    {
                      borderColor: isSeleted
                        ? theme.color.interactive[0].default.background
                        : theme.color.background.neutral[0].background,
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
            expanded={true}
            text={t(ParkingViolationTexts.selectProvider.confirm)}
            onPress={() =>
              selectedProvider ? onSelect(selectedProvider) : undefined
            }
            disabled={!selectedProvider}
          />
        </View>
      </>
    </BottomSheetModal>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  return {
    content: {
      marginHorizontal: theme.spacing.medium,
    },
    providerList: {
      marginTop: theme.spacing.medium,
      flexGrow: 1,
    },
    providerLogo: {
      borderWidth: 1,
      marginRight: theme.spacing.medium,
    },
    footer: {
      marginTop: theme.spacing.medium,
    },
  };
});
