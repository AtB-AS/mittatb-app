import {translation as _} from '../../commons';
import {orgSpecificTranslations} from '../../orgSpecificTranslations';

const UserProfileSettingsTexts = {
  header: {
    title: _('Standard reisende', 'Default traveller', 'Standard reisande'),
  },
  description: _(
    'Velg ønsket standardkategori for fremtidige billettkjøp.',
    'Select your default category for future ticket purchases.',
    'Vel ønska standardkategori for framtidige billettkjøp.',
  ),
};
export default orgSpecificTranslations(UserProfileSettingsTexts, {
  troms: {
    header: {
      title: _(
        'Standard billettkategori',
        'Default ticket category',
        'Standard billettkategori',
      ),
    },
  },
});
