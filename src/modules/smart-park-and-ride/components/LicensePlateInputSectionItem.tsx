import {useState, useEffect, useRef} from 'react';
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

  // Use custom hook for loading indicator logic (always call the hook, but only show if shouldSearch)
  const showLoadingRaw = useDelayedLoadingIndicator(
    isLoadingSvvVehicleInfo,
    isFetchingSvvVehicleInfo,
  );
  const showLoading = shouldSearch && showLoadingRaw;

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
      {shouldSearch &&
        svvVehicleInfo &&
        !showLoading &&
        !isErrorSvvVehicleInfo && (
          <View style={styles.successRow}>
            <ThemeIcon svg={statusTypeToIcon('valid', true, themeName)} />
            <ThemeText typography="body__secondary">
              {`${svvVehicleInfo.color} ${svvVehicleInfo.make} ${svvVehicleInfo.model}`}
            </ThemeText>
          </View>
        )}
      {shouldSearch &&
        isErrorSvvVehicleInfo &&
        debouncedValue &&
        !showLoading && (
          <MessageInfoBox
            type="warning"
            title={t(SmartParkAndRideTexts.add.input.vehicleNotFound.title)}
            message={t(SmartParkAndRideTexts.add.input.vehicleNotFound.message)}
            style={styles.errorBox}
          />
        )}
      {showLoading && (
        <View style={styles.loadingBox}>
          <ActivityIndicator />
        </View>
      )}
    </>
  );
};

function useDelayedLoadingIndicator(isLoading: boolean, isFetching: boolean) {
  const [showLoading, setShowLoading] = useState(false);
  const showTimeout = useRef<NodeJS.Timeout | null>(null);
  const minShowTimeout = useRef<NodeJS.Timeout | null>(null);
  const minShowUntil = useRef<number>(0);

  useEffect(() => {
    // If loading starts
    if (isLoading || isFetching) {
      // Wait 300ms before showing spinner
      showTimeout.current = setTimeout(() => {
        setShowLoading(true);
        // Spinner must show for at least 1s
        minShowUntil.current = Date.now() + 1000;
      }, 300);
    } else {
      // Loading stopped
      if (showTimeout.current) {
        clearTimeout(showTimeout.current);
        showTimeout.current = null;
      }
      // If spinner is visible, ensure it stays for 1s
      if (showLoading) {
        const remaining = minShowUntil.current - Date.now();
        if (remaining > 0) {
          minShowTimeout.current = setTimeout(() => {
            setShowLoading(false);
          }, remaining);
        } else {
          setShowLoading(false);
        }
      }
    }
    return () => {
      if (showTimeout.current) clearTimeout(showTimeout.current);
      if (minShowTimeout.current) clearTimeout(minShowTimeout.current);
    };
  }, [isLoading, isFetching, showLoading]);

  return showLoading;
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  successRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
