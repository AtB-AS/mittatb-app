import {translation as _} from '../../commons';

const TravelDateTexts = {
  header: {
    title: _('Velg starttidspunkt', 'Select start time', 'Vel starttidspunkt'),
  },
  options: {
    now: _('Nå', 'Now', 'No'),
    futureDate: _(
      'Fremtidig starttidspunkt',
      'Future start time',
      'Framtidig starttidspunkt',
    ),
  },
  primaryButton: _('Bekreft valg', 'Confirm selection', 'Bekreft val'),
  latestActivationDate: {
    warning: (latestActivationDate: string) =>
      _(
        `Billetten må aktiveres senest ${latestActivationDate}.`,
        `This ticket must be activated by ${latestActivationDate}.`,
        `Billetten må aktiverast seinast ${latestActivationDate}.`,
      ),
    selectedDateShouldBeEarlierWarning: _(
      'Din valgte dato er etter siste mulige aktiveringsdato.',
      'The selected date is later than the latest possible activation date.',
      'Din valde dato er etter siste moglege aktiveringdato.',
    ),
  },
};
export default TravelDateTexts;
