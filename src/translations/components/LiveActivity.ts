import {translation as _} from '../commons';

const LiveActivityTexts = {
  startButton: _(
    'Følg reisen på låseskjermen',
    'Follow the trip on your lock screen',
    'Følg reisa på låseskjermen',
  ),
  title: {
    walkToQuay: (quayName: string) =>
      _(`Gå til ${quayName}`, `Walk to ${quayName}`, `Gå til ${quayName}`),
    departureFrom: (quayName: string) =>
      _(
        `Neste avgang fra ${quayName}`,
        `Next departure from ${quayName}`,
        `Neste avgang frå ${quayName}`,
      ),
  },
};

export default LiveActivityTexts;
