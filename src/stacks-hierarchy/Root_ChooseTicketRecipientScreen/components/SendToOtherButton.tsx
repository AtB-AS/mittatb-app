import {RecipientSelectionState} from '@atb/stacks-hierarchy/Root_ChooseTicketRecipientScreen/types.ts';
import {Button} from '@atb/components/button';
import {Add} from '@atb/assets/svg/mono-icons/actions';
import {StaticColor} from '@atb/theme/colors.ts';
import {useTranslation} from '@atb/translations';
import OnBehalfOfTexts from '@atb/translations/screens/subscreens/OnBehalfOf.ts';

export const SendToOtherButton = ({
  state: {settingPhone},
  onPress,
  themeColor,
}: {
  state: RecipientSelectionState;
  onPress: () => void;
  themeColor: StaticColor;
}) => {
  const {t} = useTranslation();
  if (settingPhone) return null;
  return (
    <Button
      text={t(OnBehalfOfTexts.sendToOtherButton)}
      onPress={onPress}
      mode="secondary"
      type="medium"
      compact={true}
      backgroundColor={themeColor}
      leftIcon={{svg: Add}}
    />
  );
};
