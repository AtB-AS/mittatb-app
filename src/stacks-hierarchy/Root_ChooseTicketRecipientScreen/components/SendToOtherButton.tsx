import {RecipientSelectionState} from '@atb/stacks-hierarchy/Root_ChooseTicketRecipientScreen/types';
import {Button} from '@atb/components/button';
import {Add} from '@atb/assets/svg/mono-icons/actions';
import {useTranslation} from '@atb/translations';
import OnBehalfOfTexts from '@atb/translations/screens/subscreens/OnBehalfOf';
import {ContrastColor} from '@atb/theme/colors';

export const SendToOtherButton = ({
  state: {settingPhone},
  onPress,
  themeColor,
}: {
  state: RecipientSelectionState;
  onPress: () => void;
  themeColor: ContrastColor;
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
