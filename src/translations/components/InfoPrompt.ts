import {translation as _} from '../commons';

export const InfoPrompt = {
  assistantv2: {
    title: _(
      'Du prøver nå nytt reisesøk!',
      'You are now trying our new travel assistant!',
    ),
    body: {
      bulletPoints: [
        _(
          'Reiseforslagene beregnes noe annerledes enn tidligere.',
          'Trip proposals are now calculated slightly different from before.',
        ),
        _(
          'Du kan også velge å hente ut flere reiseforslag ved å trykke på "Last inn flere reiseforslag".',
          'You may also get more proposals by pressing "Load more results".',
        ),
      ],
      text: _(
        'Du kan bytte mellom gammelt og nytt reisesøk fra Min Profil-fanen.',
        'You may switch between the old and new travel assistant using the Profile tab.',
      ),
    },
    button: _('Den er grei!', 'Great!'),
  },
};

export default InfoPrompt;
