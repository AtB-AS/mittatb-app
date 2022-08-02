import orgSpecificTranslations from '@atb/translations/utils';
import {translation as _} from '../../commons';

const bulletPoint = '\u2022';

const SelectStartScreenTexts = {
  ticketing: {
    title: _('Billettkjøp', 'Ticketing'),
    texts: {
      part1Text: _(
        'I dag kan du kjøpe enkeltbillett til buss og trikk, men på sikt vil du finne alle billetter i appen.\n\n' +
          'Billettene gjelder kun på kollektivtransport som er en del av det offentlige kollektivtilbudet i Trøndelag fylke.',
        'Today you can purchase single tickets for bus and tram, and eventually you will find all tickets in the app.\n\n' +
          'The tickets only applies to public transport that is part of the public transport system in Trøndelag county.',
      ),
      part2Heading: _(
        'Billetten må kjøpes før du går om bord.',
        'The ticket must be purchased before boarding',
      ),
      part2Text: _(
        'Du trenger ikke å vise frem billetten på grønne bybusser og trikk i Trondheimsområdet. På regionbuss og båt må du vise billetten til sjåfør eller billettør.\n\n' +
          'Billetten er gyldig for påstigning helt til den utløper, altså så lenge nedtellingen varer og i sonen(e) du har kjøpt billett for.\n\n' +
          'Reiser i én sone: 1 time og 30 minutter\n' +
          'Reiser i to soner: 2 timer og 30 minutter\n' +
          'Reiser i tre soner: 3 timer og 30 minutter\n' +
          'Reiser i fire soner: 4 timer og 30 minutter\n\n' +
          'Ta kontakt med sjåføren om du har behov for en overgangsbillett.',
        'You do not need to show the ticket on green city buses and tram in the Trondheim area. Outside the Trondheim area, you must show the ticket to the driver or crew.\n\n' +
          'The ticket is valid for boarding until it expires, that is, as long as the countdown lasts and in the zone(s) you have purchased the ticket for.\n\n' +
          'Travel in one zone: 1 hour and 30 minutes\n' +
          'Travel in two zones: 2 hours and 30 minutes\n' +
          'Travel in three zones: 3 hours and 30 minutes\n' +
          'Travel in four zones: 4 hours and 30 minutes\n\n' +
          'Please contact the driver if you need a transfer ticket.',
      ),
      part3Heading: _(
        'Priser for enkeltbillett buss og trikk',
        'Prices for single ticket bus and tram',
      ),
      part3Table: {
        row1Label: _('Antall soner du reiser i', 'Number of zones traveled in'),
        row1Value1: _('1', '1'),
        row1Value2: _('2', '2'),
        row1Value3: _('3', '3'),
        row1Value4: _('4', '4'),
        row2Label: _('Voksen', 'Adult'),
        row2Value1: _('42', '42'),
        row2Value2: _('84', '84'),
        row2Value3: _('126', '126'),
        row2Value4: _('168', '168'),
        row3Label: _(
          'Barn / Honnør / Militær / Sykkel',
          'Child / Senior / Military / Bicycle',
        ),
        row3Value1: _('21', '21'),
        row3Value2: _('42', '42'),
        row3Value3: _('63', '63'),
        row3Value4: _('84', '84'),
        row4Label: _('Student', 'Student'),
        row4Value1: _('42', '42'),
        row4Value2: _('84', '84'),
        row4Value3: _('84', '84'),
        row4Value4: _('84', '84'),
      },
      part3Text_1: _(
        'For å reise med sykkel kjøper du en barnebillett.',
        'To bring a bike, buy a child ticket.',
      ),
      part3Text_2: _(
        'Ved avinstallering av appen vil også billettene fjernes. Vi advarer derfor mot avinstallering når du har kjøpt billetter. Da vil du ikke kunne framvise gyldig billett.',
        'If you uninstall the app, the tickets will be removed. We recommend that you do not uninstall once you have purchased tickets. If you uninstall, you will not be able to present a valid ticket.',
      ),
      part4Heading: _('Billettrefusjon', 'Ticket refund'),
      part4Link: {
        text: _('Se betingelser for refusjon', 'See terms for ticket refund'),
        url: _(
          'https://www.atb.no/billettrefusjon/',
          'https://www.atb.no/en/ticket-refund/',
        ),
      },
    },
  },
  payment: {},
  terms: {
    title: _('Betingelser', 'Terms'),
    texts: {
      part1Text: _(
        'Det er passasjerens ansvar',
        'As a passenger you are responsible to',
      ),
      part1Bullet1: _(
        `${bulletPoint} å ha tilstrekkelig nettdekning under kjøpsprosessen slik at kjøpet gjennomføres i sin helhet. Datatrafikk må være påslått i en kontrollsituasjon, slik at billetten og kontrollkode kan fremvises på forespørsel.`,
        `${bulletPoint} have sufficient internet connection while buying tickets and travel passes to ensure that the transactions can be fully completed. Mobile data must be enabled in case of inspection, so that the ticket and the reference code can be presented upon request.`,
      ),
      part1Bullet2: _(
        `${bulletPoint} å ha gyldig billett for reisen ved ombordstigning.`,
        `${bulletPoint} have a valid ticket upon boarding.`,
      ),
      part1Bullet3: _(
        `${bulletPoint} at mobiletelefonen fungerer normalt, skjermen er leselig og har nok batterikapasitet så lenge reisen varer slik at gyldig billett kan fremvises. Dersom du ikke kan fremvise billett, vil det anses som å reise uten gyldig billett.`,
        `${bulletPoint} make sure the phone works properly, the screen is readable and the battery has enough power to present a valid ticket during the whole trip. If you cannot provide a valid ticket upon inspection, you will be considered as travelling without a ticket.`,
      ),
      part2Heading: _(
        'Det vil komme flere betalingsmåter',
        'More methods of payment will be available',
      ),
      part2Text: _(
        'AtBs transportvedtekter og takstregler gjelder til enhver tid under hele reisen',
        'AtB’s transport regulations and fare and discount guidelines apply at all times during your trip.',
      ),
      part2Link1: {
        text: _('Transportvedtekter', 'Transport regulations'),
        url: _(
          'https://www.atb.no/transportvedtekter/',
          'https://www.atb.no/en/transport-regulations/',
        ),
      },
      part2Link2: {
        text: _('Takstregler', 'Fare and discount guidelines'),
        url: _(
          'https://www.atb.no/takstregler/',
          'https://www.atb.no/en/fare-and-discount-guidelines/',
        ),
      },
    },
  },
  inspection: {
    title: _('Billettkontroll', 'Ticket inspection'),
    texts: {
      part1Text1: _(
        'Ved billettkontroll, åpne appen din og velg hovedmenyen «Billetter» nederst i appen. Velg fanen «Aktive». Her finner du din gyldige billett. Velg «Vis detaljer/kontroll». Du får nå opp informasjon om billetten og en QR-kode. Vis denne QR-koden til kontrollør som vil scanne denne med eget utstyr for å kontrollere om billetten er gyldig.\n\n' +
          'Husk at når du reiser med rabattert billett må du kunne vise gyldig bevis som bekrefter din rett til rabatt.\n\n' +
          'Uten gyldig billett må du ved billettkontroll betale gebyr etter følgende satser:',
        'During ticket inspections, open your app and select the main menu "Tickets" at the bottom of the app. Select the "Valid" tab. Here you will find your valid ticket. Select "Show details / inspection". You will now receive information about the ticket and a QR code. Show this QR code to the ticket inspector who will scan it with his own equipment to check if the ticket is valid.\n\n' +
          'When traveling with a discounted ticket, always remember to bring valid proof of you being eligible for the discount.\n\n' +
          'Without a valid ticket, you need to pay an additional fee as described below:',
      ),
      part1Bullet1: _(
        `${bulletPoint} Voksne: 1150 kroner eller 950 kroner ved betaling på stedet.`,
        `${bulletPoint} Adult: NOK 1150 or NOK 950 for on-site payment`,
      ),
      part1Bullet2: _(
        `${bulletPoint} Mindreårige som er fylt 15 år: 900 kroner uansett oppgjørsform.`,
        `${bulletPoint} Minors over 15 years: NOK 900 regardless of payment method`,
      ),
      part1Bullet3: _(
        `${bulletPoint} Misbruk eller forfalsking av billett: 2000 kroner, og billetten blir inndratt. Dersom du forfalsker en billett, vil du også bli politianmeldt.`,
        `${bulletPoint} Travelling with a false or counterfeit ticket: NOK 2000. Passengers traveling with false tickets will be reported to the police.`,
      ),
      part1Text2: _(
        'Manglende rabattbevis: Tilleggsavgift på grunn av manglende rabattbevis under billettkontroll kan reduseres til kr 150,- dersom gyldig rabattbevis, ID og gebyr fremvises innen sju (7) dager hos AtB kundesenter.',
        'A fine due to lack of proof of your entitlement to a discount during ticket inspection may be reduced to NOK 150, - if you present valid proof, ID and fee at AtB service center within seven (7) days.',
      ),
      part1Text3: _(
        'AtBs transportvedtekter og takstregler gjelder til enhver tid under hele reisen',
        'AtB’s transport regulations and fare and discount guidelines apply at all times during your trip.',
      ),
      part1Link1: {
        text: _('Transportvedtekter', 'Transport regulations'),
        url: _(
          'https://www.atb.no/transportvedtekter/',
          'https://www.atb.no/en/transport-regulations/',
        ),
      },
      part1Link2: {
        text: _('Takstregler', 'Fare and discount guidelines'),
        url: _(
          'https://www.atb.no/takstregler/',
          'https://www.atb.no/en/fare-and-discount-guidelines/',
        ),
      },
    },
  },
};

export default orgSpecificTranslations(SelectStartScreenTexts, {
  nfk: {
    payment: {
      texts: {
        part1Text: _(
          'Alle transaksjoner utført med Vipps blir behandlet av Vipps. Har du valgt Vipps som standard betalingsmåte, vil Vipps-appen åpne seg når du skal betale. Du blir så bedt om å logge på Vipps på vanlig måte. Appen Reis vil be om tilgang til Vipps, dette må du svare ja på. Vipps vil benytte din valgte betalingsmetode, konto eller kort valgt i Vipps appen. Informasjon om din konto, dine kort eller andre personopplysninger blir ikke lagret i appen Reis eller hos Reis Nordland.',
          'All transactions performed with Vipps are processed by Vipps. If you have selected Vipps as your default payment method, the Vipps app will open when you pay. You are then asked to log in to Vipps in the usual way. The Reis app will request access to Vipps, which you must answer yes to. Vipps will use your chosen payment method, account or card selected in the Vipps app. Information about your account, your cards or other personal information is not stored in the Reis app or at Reis Nordland.',
        ),
      },
    },
  },
});
