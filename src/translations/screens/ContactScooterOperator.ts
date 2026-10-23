import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {SupportType} from '@atb/api/types/mobility';
import {translation as _} from '../commons';

export const ContactShmoOperatorTexts = {
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
            'Accident or damage',
            'Ulykke eller skade',
          );
        case SupportType.REFUND:
          return _('Refusjon', 'Refund', 'Refusjon');
        case SupportType.OTHER:
        default:
          return _('Annet', 'Other', 'Anna');
      }
    },
    noEndInfo: (
      operatorName: string,
      maxRentalDuration: string,
      formFactor: FormFactor | undefined,
    ) => {
      switch (formFactor) {
        case FormFactor.Bicycle:
          return _(
            `Alle turer avsluttes etter ${maxRentalDuration}. Sett fra deg sykkelen i et stativ og send inn dette skjemaet slik at ${operatorName} kan rette opp feilen.`,
            `All trips end after ${maxRentalDuration}. Return the bike to a dock and submit this form so that ${operatorName} can correct the error.`,
            `Alle turar blir avslutta etter ${maxRentalDuration}. Sett frå deg sykkelen i eit stativ og send inn dette skjemaet slik at ${operatorName} kan retta opp feilen.`,
          );
        default:
          return _(
            `Alle turer avsluttes etter ${maxRentalDuration}. Sett kjøretøyet på et trygt sted og send inn dette skjemaet slik at ${operatorName} kan rette opp feilen.`,
            `All trips end after ${maxRentalDuration}. Park the vehicle in a safe spot and submit this form so that ${operatorName} can correct the error.`,
            `Alle turar blir avslutta etter ${maxRentalDuration}. Sett køyretøyet på ein trygg stad og send inn dette skjemaet slik at ${operatorName} kan retta opp feilen.`,
          );
      }
    },
  },
  comment: {
    header: _('Vennligst utdyp', 'Please elaborate', 'Ver vennleg og utdjup'),
    label: _('Kommentar', 'Comment', 'Kommentar'),
    placeholder: _('Legg til kommentar', 'Add a comment', 'Legg til kommentar'),
    errorMessage: (maxCommentLength: number) =>
      _(
        `Kommentaren er for lang. Det er maks ${maxCommentLength} tegn.`,
        `The comment is too long. There is a maximum of ${maxCommentLength} characters.`,
        `Kommentaren er for lang. Det er maks ${maxCommentLength} teikn.`,
      ),
  },
  image: {
    header: (maxFiles: number) =>
      _(
        `Legg ved bilde (maks ${maxFiles} bilder)`,
        `Attach image (max ${maxFiles} images)`,
        `Legg ved bilete (maks ${maxFiles} bilete)`,
      ),
    addButton: _('Legg ved bilde', 'Attach image', 'Legg ved bilete'),
    label: (index: number) =>
      _(`Bilde ${index}`, `Image ${index}`, `Bilete ${index}`),
    view: _('Vis', 'View', 'Vis'),
    keep: _('Behold', 'Keep', 'Behald'),
    removeA11yHint: (index: number) =>
      _(
        `Trykk for å se eller fjerne bilde ${index}`,
        `Press to view or remove image ${index}`,
        `Trykk for å sjå eller fjerne bilete ${index}`,
      ),
    source: {
      title: _('Legg ved bilde', 'Attach image', 'Legg ved bilete'),
      camera: _('Ta bilde', 'Take photo', 'Ta bilete'),
      library: _(
        'Velg fra bildegalleri',
        'Choose from photo library',
        'Vel frå biletgalleri',
      ),
    },
    camera: {
      title: _(
        'Ta bilde av feilen',
        'Photograph the fault',
        'Ta bilete av feilen',
      ),
      instruction: _(
        'Vis gjerne hele kjøretøyet og det som er galt.',
        'Try to show the whole vehicle and what is wrong with it.',
        'Vis gjerne heile køyretøyet og det som er gale.',
      ),
    },
    error: _(
      'Vi klarte ikke å hente bildet. Vennligst prøv på nytt.',
      'We could not load the image. Please try again.',
      'Vi klarte ikkje å hente biletet. Ver vennleg og prøv på nytt.',
    ),
  },
  contactInfo: {
    header: _(
      'Din kontaktinfo (E-postadresse er obligatorisk)',
      'Your contact info (Email address is required)',
      'Kontaktinfoen din (E-postadressa er obligatorisk)',
    ),
    email: {
      label: _('E-postadresse', 'E-mail address', 'E-postadresse'),
      placeholder: _(
        'Legg til e-postadresse',
        'Add email address',
        'Legg til e-postadresse',
      ),
      errorMessage: _(
        `Vennligst legg inn en gyldig e-postadresse`,
        `Please enter a valid e-mail adress.`,
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
        `Please enter a valid phone number.`,
        `Ver vennleg og legg til eit gyldig telefonnummer.`,
      ),
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
        `Your location will be shared with ${operatorName}. ${operatorName} may contact you by e-mail or phone if necessary.`,
        `Lokasjonen din blir delt med ${operatorName}. ${operatorName} kan ta kontakt med deg på e-post eller telefon ved behov.`,
      );
    },
  },
  submitButton: _('Send inn', 'Submit', 'Send inn'),

  submitError: (operatorName: string) => {
    return _(
      `Noe gikk galt, vi klarte ikke å sende meldingen til ${operatorName}. Vennligst prøv på nytt.`,
      `Something went wrong, we could not send the message to ${operatorName}. Please try again.`,
      `Noko gjekk gale, vi klarte ikkje å sende meldinga til ${operatorName}. Vennligst prøv på nytt.`,
    );
  },
  confirmation: {
    title: (operatorName: string) => {
      return _(
        `Melding sendt til ${operatorName}`,
        `Message sent to ${operatorName}`,
        `Melding sendt til ${operatorName}`,
      );
    },
    description: (operatorName: string) => {
      return _(
        `${operatorName} kan ta kontakt med deg ved behov.`,
        `${operatorName} can contact you if necessary.`,
        `${operatorName} kan ta kontakt med deg ved behov.`,
      );
    },
  },
};
