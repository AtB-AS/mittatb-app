import {RecipientSelectionState} from '@atb/stacks-hierarchy/Root_ChooseTicketRecipientScreen/types';
import {Button} from '@atb/components/button';
import {Add} from '@atb/assets/svg/mono-icons/actions';
import {useTranslation} from '@atb/translations';
import OnBehalfOfTexts from '@atb/translations/screens/subscreens/OnBehalfOf';

export const SendToOtherButton = ({
  state: {settingPhone},
  onPress,
}: {
  state: RecipientSelectionState;
  onPress: () => void;
}) => {
  const {t} = useTranslation();
  if (settingPhone) return null;
  return (
    <Button
      surfaceColor="accent"
      expanded={false}
      text={t(OnBehalfOfTexts.sendToOtherButton)}
      onPress={onPress}
      mode="secondary"
      type="small"
      leftIcon={{svg: Add}}
    />
  );
};
