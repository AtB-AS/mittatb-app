import {View, ActivityIndicator} from 'react-native';
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

type LicensePlateInputSectionItemProps = {
  value: string;
  onChange: (val: string) => void;
  autoFocus?: boolean;
  placeholder?: string;
  label?: string;
};

export const LicensePlateInputSectionItem = ({
  value,
  onChange,
  autoFocus = false,
  placeholder,
  label,
}: LicensePlateInputSectionItemProps) => {
  const {themeName} = useThemeContext();
  const {t} = useTranslation();
  const styles = useStyles();
  const debouncedValue = useDebounce(value, 400);

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
          label={label || t(SmartParkAndRideTexts.add.input.label)}
          placeholder={
            placeholder || t(SmartParkAndRideTexts.add.input.placeholder)
          }
          onChangeText={onChange}
          autoCapitalize="characters"
          value={value}
          inlineLabel={false}
          autoFocus={autoFocus}
          maxLength={9}
        />
      </Section>
      {!!showSuccessMessage && (
        <View style={styles.successRow}>
          <ThemeIcon svg={statusTypeToIcon('valid', true, themeName)} />
          <ThemeText typography="body__secondary">
            {`${svvVehicleInfo.color} ${svvVehicleInfo.make} ${svvVehicleInfo.model}`}
          </ThemeText>
        </View>
      )}
      {!!showErrorMessage && (
        <MessageInfoBox
          type="warning"
          title={t(SmartParkAndRideTexts.add.input.vehicleNotFound.title)}
          message={t(SmartParkAndRideTexts.add.input.vehicleNotFound.message)}
          style={styles.errorBox}
        />
      )}
      {!!showLoading && (
        <View style={styles.loadingBox}>
          <ActivityIndicator />
        </View>
      )}
    </>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  successRow: {
    flexDirection: 'row',
    marginTop: theme.spacing.medium,
    gap: theme.spacing.small,
  },
  errorBox: {
    marginTop: theme.spacing.medium,
  },
  loadingBox: {
    marginTop: theme.spacing.medium,
    alignItems: 'flex-start',
  },
}));
