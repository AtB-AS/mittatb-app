import React, {useState} from 'react';
import {View} from 'react-native';
import {isErrorResponse} from '@atb/api/utils';
import {StyleSheet} from '@atb/theme';
import {TicketingTexts, useTranslation} from '@atb/translations';
import {Button} from '@atb/components/button';
import {ThemeText} from '@atb/components/text';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {TextInputSectionItem} from '@atb/components/sections';
import {useAcceptTicketTransferMutation} from '@atb/modules/ticketing';
import {giveFocus} from '@atb/utils/use-focus-on-load';
import {useThemeContext} from '@atb/theme';
import {
  BottomSheetHeaderType,
  BottomSheetModal,
} from '@atb/components/bottom-sheet';
import {BottomSheetModal as GorhomBottomSheetModal} from '@gorhom/bottom-sheet';
import {ThemedTicketTilted} from '@atb/theme/ThemedAssets';

const MIN_CODE_LENGTH = 8;

type Props = {
  bottomSheetModalRef: React.RefObject<GorhomBottomSheetModal | null>;
  onCloseFocusRef: React.RefObject<View | null>;
  onTicketsReceived: () => void;
};

export const TransferCodeBottomSheet = ({
  bottomSheetModalRef,
  onCloseFocusRef,
  onTicketsReceived,
}: Props) => {
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const styles = useStyles();
  const [code, setCode] = useState('');
  const {mutate, isPending, error, reset} = useAcceptTicketTransferMutation();

  const onSubmit = () =>
    mutate(code, {
      onSuccess: () => {
        bottomSheetModalRef.current?.dismiss();
        onTicketsReceived();
      },
    });

  const errorText = error
    ? isErrorResponse(error) && error.http.code === 404
      ? t(TicketingTexts.transferCode.bottomSheet.errorNotFound)
      : t(TicketingTexts.transferCode.bottomSheet.errorGeneric)
    : undefined;

  return (
    <BottomSheetModal
      bottomSheetModalRef={bottomSheetModalRef}
      heading={t(TicketingTexts.transferCode.bottomSheet.heading)}
      bottomSheetHeaderType={BottomSheetHeaderType.Close}
      closeCallback={() => {
        giveFocus(onCloseFocusRef);
        setCode('');
        reset();
      }}
      testID="transferCodeBottomSheet"
    >
      <View style={styles.container}>
        <Section>
          <TextInputSectionItem
            label={t(TicketingTexts.transferCode.bottomSheet.inputLabel)}
            placeholder={t(
              TicketingTexts.transferCode.bottomSheet.inputPlaceholder,
            )}
            inlineLabel={false}
            value={code}
            onChangeText={(newCode) => {
              setCode(newCode.trim());
              if (error) reset();
            }}
            showClear={true}
            autoCapitalize="none"
            autoCorrect={false}
            errorText={errorText}
            testID="transferCodeInput"
          />
        </Section>
        <Button
          expanded={true}
          interactiveColor={theme.color.interactive[0]}
          text={t(TicketingTexts.transferCode.bottomSheet.submit)}
          onPress={onSubmit}
          disabled={code.length < MIN_CODE_LENGTH}
          loading={isPending}
          testID="transferCodeSubmitButton"
        />
        <Section>
          <GenericSectionItem>
            <View style={styles.infoContainer}>
              <View style={styles.infoText}>
                <ThemeText typography="body__m__strong">
                  {t(TicketingTexts.transferCode.bottomSheet.infoTitle)}
                </ThemeText>
                <ThemeText typography="body__s" type="secondary">
                  {t(TicketingTexts.transferCode.bottomSheet.infoBody)}
                </ThemeText>
              </View>
              <ThemedTicketTilted width={96} height={96} />
            </View>
          </GenericSectionItem>
        </Section>
      </View>
    </BottomSheetModal>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    gap: theme.spacing.medium,
    marginHorizontal: theme.spacing.medium,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.large,
  },
  infoText: {
    flex: 1,
    gap: theme.spacing.xSmall,
  },
}));
