import {SupportType} from '@atb/api/types/mobility';
import {translation as _} from '../commons';

export const ContactOperatorTexts = {
  title: (operatorName: string) => {
    return _(
      `Kontakt ${operatorName}`,
      `Contact ${operatorName}`,
      `Kontakt ${operatorName}`,
    );
  },

  supportType: {
    header: _(
      'Hva trenger du hjelp med?',
      'What do you need help with?',
      'Kva treng du hjelp med?',
    ),
    supportTypeDescription: (supportType: SupportType) => {
      switch (supportType) {
        case SupportType.UNABLE_TO_OPEN:
          return _(
            'Får ikke startet turen',
            'Unable to start a trip',
            'Får ikkje starta turen',
          );
        case SupportType.UNABLE_TO_CLOSE:
          return _(
            'Får ikke avsluttet turen',
            'Unable to end the trip',
            'Får ikkje avslutta turen',
          );
        case SupportType.ACCIDENT_OR_BROKEN:
          return _(
            'Ulykke eller skade',
            'Accident or broken',
            'Ulykke eller skade',
          );
        case SupportType.REFUND:
          return _('Refusjon', 'Refund', 'Refusjon');
        case SupportType.OTHER:
        default:
          return _('Annet', 'Other', 'Anna');
      }
    },
    noEndInfo: (operatorName: string) => {
      return _(
        `Alle turer avsluttes etter én time. Sett sparkesykkelen på et trygt sted og send inn dette skjemaet slik at ${operatorName} kan rette opp feilen.`,
        `All trips end after one hour. Park the scooter in a safe spot and submit this form so that ${operatorName} can correct the error.`,
        `Alle turar blir avslutta etter éin time. Sett sparkesykkelen på ein trygg stad og send inn dette skjemaet slik at ${operatorName} kan retta opp feilen.`,
      );
    },
  },
  comment: {
    header: _('Vennligst utdyp', 'Please elaborate', 'Ver vennleg og utdjup'),
    label: _('Kommentar', 'Comment', 'Kommentar'),
    placeholder: _('Legg til kommentar', 'Add a comment', 'Legg til kommentar'),
    errorMessage: _(
      'Kommentaren er for lang. Det er maks 1000 tegn.',
      'The comment is too long. There is a maximum of 1000 characters.',
      'Kommentaren er for lang. Det er maks 1000 teikn.',
    ),
  },
  contactInfo: {
    header: _(
      'Din kontaktinformasjon (obligatorisk med minst én)',
      'Contact information (at least one required)',
      'Kontaktinfoen din (obligatorisk med minst éin)',
    ),
    email: {
      label: _('E-postadresse', 'E-mail address', 'E-postadresse'),
      placeholder: _(
        'Legg til e-post',
        'Add e-mail address',
        'Legg til e-post',
      ),
      errorMessage: _(
        `Vennligst legg inn en gyldig e-postadresse`,
        `Please add a valid e-mail adress.`,
        `Ver vennleg og legg inn ei gyldig e-postadresse.`,
      ),
    },
    phone: {
      label: _('Telefon', 'Phone', 'Telefon'),
      placeholder: _(
        'Legg til telefon',
        'Add phone number',
        'Legg til telefon',
      ),
      errorMessage: _(
        `Vennligst legg til et gyldig telefonnummer.`,
        `Please add a valid phone number.`,
        `Ver vennleg og legg til eit gyldig telefonnummer.`,
      ),
    },
    errorMessage: (operatorName: string) => {
      return _(
        `Vennligst legg til enten telefonnummer eller e-postadresse. ${operatorName} trenger det for å kontakte deg.`,
        `Please add a phone number or email adress. ${operatorName} needs it to contact you.`,
        `Ver vennleg og legg til anten telefonnummer eller e-postadresse. ${operatorName} treng det for å kontakta deg.`,
      );
    },
  },
  location: {
    header: _(
      'Lokasjon og kontakt',
      'Location and contact',
      'Lokasjon og kontakt',
    ),
    description: (operatorName: string) => {
      return _(
        `Lokasjonen din blir delt med ${operatorName}. ${operatorName} kan ta kontakt med deg på e-post eller telefon ved behov.`,
        `Your location will be shared with ${operatorName}. ${operatorName} can contact you by e-mail or phone if necessary.`,
        `Lokasjonen din blir delt med ${operatorName}. ${operatorName} kan ta kontakt med deg på e-post eller telefon ved behov.`,
      );
    },
  },
  submitButton: _('Send inn', 'Submit', 'Send inn'),
};
