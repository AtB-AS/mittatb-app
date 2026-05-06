import {orgSpecificTranslations} from '@atb/translations/orgSpecificTranslations';
import {translation as _} from '../../commons';

const TripDetailsTexts = {
  trip: {
    leg: {
      lastPassedStop: (quayName: string, time: string) =>
        _(
          `Passerte ${quayName} kl. ${time}`,
          `Passed ${quayName} at ${time}`,
          `Passerte ${quayName} kl. ${time}`,
        ),
      transport: {
        lineA11yLabel: (modeName: string, lineName: string) =>
          _(
            `${modeName} linje ${lineName}`,
            `${modeName} line ${lineName}`,
            `${modeName} linje ${lineName}`,
          ),
        a11yHint: _(
          'Aktiver for å se detaljer om linjen',
          'Activate to see line details',
          'Aktiver for å sjå detaljar om linja',
        ),
        a11yLabel: {
          base: (
            time: string,
            modeName: string,
            lineName: string,
            fromPlace: string,
            toPlace: string,
          ) =>
            _(
              `Klokken ${time}, ta ${modeName} ${lineName} fra ${fromPlace} til ${toPlace}`,
              `At ${time}, take ${modeName} ${lineName} from ${fromPlace} to ${toPlace}`,
              `Klokka ${time}, ta ${modeName} ${lineName} frå ${fromPlace} til ${toPlace}`,
            ),
          intermediateStops: (count: number) =>
            _(
              count === 1 ? `${count} mellomstopp` : `${count} mellomstopp`,
              count === 1
                ? `${count} intermediate stop`
                : `${count} intermediate stops`,
              count === 1 ? `${count} mellomstopp` : `${count} mellomstopp`,
            ),
          arrival: (toPlace: string, time: string) =>
            _(
              `Ankomst ${toPlace} klokken ${time}`,
              `Arrival ${toPlace} at ${time}`,
              `Framkomst ${toPlace} klokka ${time}`,
            ),
          notices: (count: number) =>
            _(
              count === 1 ? `${count} merknad` : `${count} merknader`,
              count === 1 ? `${count} notice` : `${count} notices`,
              count === 1 ? `${count} merknad` : `${count} merknader`,
            ),
          warnings: (count: number) =>
            _(
              count === 1 ? `${count} advarsel` : `${count} advarsler`,
              count === 1 ? `${count} warning` : `${count} warnings`,
              count === 1 ? `${count} åtvaring` : `${count} åtvaringar`,
            ),
          errors: (count: number) =>
            _(
              count === 1 ? `${count} feil` : `${count} feil`,
              count === 1 ? `${count} error` : `${count} errors`,
              count === 1 ? `${count} feil` : `${count} feil`,
            ),
          hint: (fromPlace: string) =>
            _(
              `Aktiver for å se alle avganger fra ${fromPlace}`,
              `Activate to see all departures from ${fromPlace}`,
              `Aktiver for å sjå alle avgangar frå ${fromPlace}`,
            ),
        },
      },
      buyTicketFrom: _(
        'Billett kan kjøpes fra',
        'Ticket can be bought from',
        'Billett kan kjøpast frå',
      ),
      buyTicketFromA11yLabel: (authorityName: string) =>
        _(
          `Billett kan kjøpes fra ${authorityName}, åpner side i nettleser`,
          `Ticket can be bought from ${authorityName}, opens page in browser`,
          `Billett kan kjøpast frå ${authorityName}, opnar side i nettlesar`,
        ),
      live: (transportMode: string) =>
        _(
          `Følg ${transportMode.toLowerCase()}`,
          `Follow ${transportMode.toLowerCase()}`,
          `Følg ${transportMode.toLowerCase()}`,
        ),
      intermediateStops: {
        a11yLabel: (count: number, duration: string) =>
          _(
            `${count} mellomstopp. ${duration}.`,
            `${count} intermediate stop. ${duration}.`,
            `${count} mellomstopp. ${duration}.`,
          ),
        label: (count: number, duration: string) =>
          _(
            `${count} mellomstopp (${duration})`,
            count > 1
              ? `${count} intermediate stops (${duration})`
              : `${count} intermediate stop (${duration})`,
            `${count} mellomstopp (${duration})`,
          ),
        a11yHint: _(
          'Aktivér for å vise alle mellomstopp.',
          'Activate to show intermediate stops',
          'Aktiver for å vise alle mellomstopp',
        ),
      },
      walk: {
        label: (duration: string) =>
          _(`Gå i ${duration}`, `Walk for ${duration}`, `Gå i ${duration}`),
        labelWithDistance: (duration: string, distance: string) =>
          _(
            `Gå i ${duration} (${distance})`,
            `Walk for ${duration} (${distance})`,
            `Gå i ${duration} (${distance})`,
          ),
        a11yLabel: {
          base: (
            time: string,
            duration: string,
            fromPlace: string,
            toPlace: string,
          ) =>
            _(
              `Klokken ${time}, gå i ${duration} fra ${fromPlace} til ${toPlace}`,
              `At ${time}, walk for ${duration} from ${fromPlace} to ${toPlace}`,
              `Klokka ${time}, gå i ${duration} frå ${fromPlace} til ${toPlace}`,
            ),
          baseShortWalk: (time: string, fromPlace: string, toPlace: string) =>
            _(
              `Klokken ${time}, gå i mindre enn ett minutt fra ${fromPlace} til ${toPlace}`,
              `At ${time}, walk for less than a minute from ${fromPlace} to ${toPlace}`,
              `Klokka ${time}, gå i mindre enn eitt minutt frå ${fromPlace} til ${toPlace}`,
            ),
          distance: (distance: string) =>
            _(`${distance} gange`, `${distance} walking`, `${distance} gange`),
          waitTime: (waitTime: string) =>
            _(
              `Vent i opptil ${waitTime}`,
              `Wait for up to ${waitTime}`,
              `Vent i opptil ${waitTime}`,
            ),
        },
      },
      bicycle: {
        label: (duration: string) =>
          _(
            `Sykle i ${duration}`,
            `Ride for ${duration}`,
            `Sykle i ${duration}`,
          ),
        labelWithDistance: (duration: string, distance: string) =>
          _(
            `Sykle i ${duration} (${distance})`,
            `Ride for ${duration} (${distance})`,
            `Sykle i ${duration} (${distance})`,
          ),
        a11yLabel: {
          base: (
            time: string,
            duration: string,
            fromPlace: string,
            toPlace: string,
          ) =>
            _(
              `Klokken ${time}, sykle i ${duration} fra ${fromPlace} til ${toPlace}`,
              `At ${time}, ride for ${duration} from ${fromPlace} to ${toPlace}`,
              `Klokka ${time}, sykle i ${duration} frå ${fromPlace} til ${toPlace}`,
            ),
          distance: (distance: string) =>
            _(
              `${distance} sykling`,
              `${distance} cycling`,
              `${distance} sykling`,
            ),
          waitTime: (waitTime: string) =>
            _(
              `Vent i opptil ${waitTime}`,
              `Wait for up to ${waitTime}`,
              `Vent i opptil ${waitTime}`,
            ),
        },
      },
      shortWalk: _(
        `Gå i mindre enn ett minutt`,
        `Walk for less than a minute`,
        `Gå i mindre enn eitt minutt`,
      ),
      wait: {
        label: (time: string) =>
          _(`Vent i ${time}`, `Wait for ${time}`, `Vent i ${time}`),
        messages: {
          shortTime: _(
            'Kort byttetid',
            'Short changeover time',
            'Kort byttetid',
          ),
        },
      },
      end: {
        a11yLabel: (placeName: string, time: string) =>
          _(
            `Ankomst ${placeName} klokken ${time}`,
            `Arrival ${placeName} at ${time}`,
            `Framkomst ${placeName} klokka ${time}`,
          ),
        a11yHint: (placeName: string) =>
          _(
            `Aktiver for å se alle avganger fra ${placeName}`,
            `Activate to see all departures from ${placeName}`,
            `Aktiver for å sjå alle avgangar frå ${placeName}`,
          ),
      },
    },
    summary: {
      showTripInMap: {
        label: _('Se reiserute', 'Show trip', 'Sjå reiserute'),
      },
    },
    buyTicket: {
      text: _('Kjøp billett', 'Buy ticket', 'Kjøp billett'),
      a11yLabel: _(
        'Aktiver for å kjøpe billett',
        'Activate to buy ticket',
        'Aktiver for å kjøpe billett',
      ),
    },
  },
  messages: {
    shortTime: _(
      'Vær oppmerksom på kort byttetid.',
      'Please note short changeover time.',
      'Ver merksam på kort byttetid.',
    ),
    correspondenceNotGuaranteed: _('', '', ''),
    errorNetwork: _(
      'Hei, er du på nett? Vi kan ikke hente reiseforslag siden nettforbindelsen din mangler eller er ustabil.',
      `Are you online? We're unable to conduct a search since your device seems to be offline or the connection is unstable`,
      'Hei, er du på nett? Vi kan ikkje hente reiseforslag sidan tilkoplinga di til internett manglar eller er ustabil.',
    ),
    errorDefault: _(
      'Vi kunne ikke oppdatere reiseforslaget ditt. Det kan hende reisen har endra seg eller er utdatert?',
      'We could not update your trip plan. Perhaps your trip has changed or timed out?',
      'Vi kunne ikkje oppdatere reiseforslaget ditt. Det kan hende reisa har endra seg eller er utdatert.',
    ),
    tripIncludesRailReplacementBus: _(
      'Reisen inkluderer buss for tog.',
      'This trip includes rail replacement bus.',
      'Reisa inkluderer buss for tog.',
    ),
    departureIsRailReplacementBus: _(
      'Buss for tog',
      'Rail replacement bus',
      'Buss for tog',
    ),
    interchange: (
      fromPublicCode: string,
      toPublicCode: string,
      location: string,
    ) =>
      _(
        `Korrespondanse mellom ${fromPublicCode} og ${toPublicCode} på ${location}.`,
        `Correspondance between ${fromPublicCode} and ${toPublicCode} on ${location}.`,
        `Korrespondanse mellom ${fromPublicCode} og ${toPublicCode} på ${location}.`,
      ),
    interchangeWithUnknownFromPublicCode: (
      toPublicCode: string,
      location: string,
    ) =>
      _(
        `Korrespondanse med ${toPublicCode} på ${location}.`,
        `Correspondance with ${toPublicCode} on ${location}.`,
        `Korrespondanse med ${toPublicCode} på ${location}.`,
      ),
    interchangeMaxWait: (maxWaitTime: string) =>
      _(
        `Venter inntil ${maxWaitTime}.`,
        `Waiting up to ${maxWaitTime}.`,
        `Ventar i opp til ${maxWaitTime}.`,
      ),
    lineChangeStaySeated: (fromPublicCode: string, toPublicCode: string) =>
      _(
        `Bli sittende. Linjenummeret endres fra ${fromPublicCode} til ${toPublicCode}.`,
        `Stay seated. The line number is changing from ${fromPublicCode} to ${toPublicCode}.`,
        `Bli sittande. Linjenummeret endrar seg frå ${fromPublicCode} til ${toPublicCode}.`,
      ),
  },
  flexibleTransport: {
    needsBookingWhatIsThisTitle: (publicCode: string) =>
      _(
        `Hva er ${publicCode}?`,
        `What is ${publicCode}?`,
        `Kva er ${publicCode}?`,
      ),
    contentTitle: (publicCode: string) =>
      _(
        `${publicCode} kjører på bestilling innenfor bestemte soner og tider.`,
        `${publicCode} runs on demand within specific zones and times.`,
        `${publicCode} køyrer på bestilling innanfor bestemte sonar og tider.`,
      ),
    steps: [
      _(
        `Reserver sete i taxi/minibuss.`,
        `Book a seat in a taxi/minibus.`,
        `Reserver sete i taxi/minibuss.`,
      ),
      _(
        `Motta bekreftelse og hentetidspunkt på SMS.`,
        `Receive confirmation and pick-up time by SMS.`,
        `Motta bekrefting og hentetidspunkt på SMS.`,
      ),
      _(
        `Kjøp vanlig bussbillett før du går om bord.`,
        `Buy a regular bus ticket before boarding.`,
        `Kjøp vanlig bussbillett før du går om bord.`,
      ),
    ],
    readMoreAbout: (publicCode: string) =>
      _(
        `Mer om ${publicCode}`,
        `More about ${publicCode}`,
        `Meir om ${publicCode}`,
      ),
    readMoreAboutA11yHint: (publicCode: string) =>
      _(
        `Mer om ${publicCode} på ekstern lenke`,
        `More about ${publicCode} (external content)`,
        `Meir om ${publicCode} på ekstern lenke`,
      ),
    bookOnline: _(`Reserver på nett`, `Book online`, `Reserver på nett`),
    bookOnlineA11yHint: _(
      `Reserver på nett på ekstern side`,
      `Book online (external content)`,
      `Reserver på nett på ekstern side`,
    ),
    bookByPhone: (phone: string) =>
      _(
        `Reserver på tlf. ${phone}`,
        `Book by phone ${phone}`,
        `Reserver på tlf. ${phone}`,
      ),
    bookByPhoneA11yHint: _(
      `Klikk for å ringe`,
      `Tap to call`,
      `Klikk for å ringe`,
    ),
    onDemandTransportLabel: _(
      `Bestillingstransport`,
      `On-demand transport`,
      `Bestillingstransport`,
    ),
    needsBookingAndIsAvailable: (formattedTimeForBooking: string) =>
      _(
        `Denne reisen krever reservasjon innen ${formattedTimeForBooking}.`,
        `This trip requires booking before ${formattedTimeForBooking}.`,
        `Denne reisa krever reservasjon innen ${formattedTimeForBooking}.`,
      ),
    needsBookingButIsTooEarly: (formattedTimeForBooking: string) =>
      _(
        `Denne reisen krever reservasjon og kan tidligst reserveres ${formattedTimeForBooking}.`,
        `This trip requires booking and can be booked no earlier than ${formattedTimeForBooking}.`,
        `Denne reisa krever reservasjon og kan tidlegast reserverast ${formattedTimeForBooking}.`,
      ),
    needsBookingButIsTooLate: _(
      `Denne reisen krever reservasjon. Frist for reservasjon har utløpt.`,
      `This trip requires booking. The booking deadline has expired.`,
      `Denne reisa krever reservasjon. Frist for reservasjon har utgått.`,
    ),
    needsBookingWhatIsThis: (publicCode: string) =>
      _(
        `Hva er ${publicCode}?`,
        `What is ${publicCode}?`,
        `Kva er ${publicCode}?`,
      ),
  },
};
export default orgSpecificTranslations(TripDetailsTexts, {
  fram: {
    messages: {
      correspondenceNotGuaranteed: _(
        'Kan ikke garantere korrespondanse.',
        'Cannot guarantee correspondence.',
        'Kan ikkje garantere korrespondanse',
      ),
    },
  },
});
