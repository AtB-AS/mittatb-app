// env vars:
//   OVERVIEW_START, DETAILS_START:       start time as shown, e.g. '14:05'
//   OVERVIEW_DURATION, DETAILS_DURATION: duration as shown, e.g. '12 min'
//
// Compares the trip times from the travel search overview and the trip details.
// Start times may differ by 2 minutes and durations by 1 minute since the
// overview and details round differently.

const acceptableStartTimeDiff = 2;
const acceptableDurationDiff = 1;

function toMinutes(time) {
  const match = /(\d+):(\d+)/.exec(time);
  return match ? Number(match[1]) * 60 + Number(match[2]) : NaN;
}

function firstNumber(text) {
  const match = /(\d+)/.exec(text);
  return match ? Number(match[1]) : NaN;
}

output.startTimeIsCorrect =
  Math.abs(toMinutes(OVERVIEW_START) - toMinutes(DETAILS_START)) <=
  acceptableStartTimeDiff;
output.durationIsCorrect =
  Math.abs(firstNumber(OVERVIEW_DURATION) - firstNumber(DETAILS_DURATION)) <=
  acceptableDurationDiff;
