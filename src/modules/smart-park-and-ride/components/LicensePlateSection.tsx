import {View} from 'react-native';
import {Section, TextInputSectionItem} from '@atb/components/sections';
import {useThemeContext} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import SmartParkAndRideTexts from '@atb/translations/screens/subscreens/SmartParkAndRide';
import {useSearchVehicleInformationQuery} from '@atb/modules/smart-park-and-ride';
import {useDebounce} from '@atb/utils/use-debounce';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {ThemeIcon} from '@atb/components/theme-icon';
import {statusTypeToIcon} from '@atb/utils/status-type-to-icon';
import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {Loading} from '@atb/components/loading';

type LicensePlateInputSectionItemProps = {
  inputProps: {label?: string} & Omit<
    React.ComponentProps<typeof TextInputSectionItem>,
    'label'
  >;
};

export const LicensePlateSection = ({
  inputProps: {label, placeholder, value, ...textInputSectionItemProps},
}: LicensePlateInputSectionItemProps) => {
  const {themeName} = useThemeContext();
  const {t} = useTranslation();
  const styles = useStyles();
  const debouncedValue = useDebounce(value, 400) ?? '';

  // Only perform search if input is at least 2 characters
  const shouldSearch = debouncedValue.length >= 2;

  // Query for vehicle info (always call the hook, but pass empty string if not searching)
  const {
    isLoading: isLoadingSvvVehicleInfo,
    isFetching: isFetchingSvvVehicleInfo,
    isError: isErrorSvvVehicleInfo,
    data: svvVehicleInfo,
  } = useSearchVehicleInformationQuery(shouldSearch, debouncedValue);

  const showLoading =
    shouldSearch && (isLoadingSvvVehicleInfo || isFetchingSvvVehicleInfo);
  const showSuccessMessage =
    shouldSearch && svvVehicleInfo && !showLoading && !isErrorSvvVehicleInfo;
  const showErrorMessage =
    shouldSearch && isErrorSvvVehicleInfo && !showLoading;

  return (
    <>
      <Section>
        <TextInputSectionItem
          label={
            label || t(SmartParkAndRideTexts.add.inputs.licensePlate.label)
          }
          placeholder={
            placeholder ||
            t(SmartParkAndRideTexts.add.inputs.licensePlate.placeholder)
          }
          value={value}
          autoCapitalize="characters"
          inlineLabel={false}
          maxLength={14}
          returnKeyType="done"
          {...textInputSectionItemProps}
        />
      </Section>

      {!!showSuccessMessage && (
        <View style={styles.successRow}>
          <ThemeIcon svg={statusTypeToIcon('valid', true, themeName)} />
          <ThemeText typography="body__s">
            {`${svvVehicleInfo.color} ${svvVehicleInfo.make} ${svvVehicleInfo.model}`}
          </ThemeText>
        </View>
      )}
      {!!showErrorMessage && (
        <MessageInfoBox
          type="info"
          title={t(
            SmartParkAndRideTexts.add.inputs.licensePlate.vehicleNotFound.title,
          )}
          message={t(
            SmartParkAndRideTexts.add.inputs.licensePlate.vehicleNotFound
              .message,
          )}
        />
      )}
      {!!showLoading && (
        <View style={styles.loadingBox}>
          <Loading />
        </View>
      )}
    </>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  successRow: {
    flexDirection: 'row',
    gap: theme.spacing.small,
  },
  loadingBox: {
    alignItems: 'flex-start',
  },
}));
