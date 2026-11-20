// env vars:
//   DAY:    target day of week, ISO-8601 numbering (1 = Monday ... 7 = Sunday)
//   HOUR:   target hour, 12-hour format as shown on the picker (1-12)
//   AM_PM:  target period, 'AM' or 'PM'
//
// Computes how many ticks needed to swipe the
// native date/time picker's date, hour and AM/PM columns to reach the
// target, relative to the device's actual current date/time. Date is target day of week ahead.

const targetDayOfWeek = Number(DAY);
const targetHour12 = Number(HOUR);
const targetIsAM = AM_PM.toUpperCase() === 'AM';

const now = new Date();

// JS getDay() is 0 (Sun) - 6 (Sat); convert to ISO 1 (Mon) - 7 (Sun)
const currentDayIso = now.getDay() === 0 ? 7 : now.getDay();
output.daysToTarget = (targetDayOfWeek - currentDayIso + 7) % 7 || 7;

function to12(hour24) {
  const v = hour24 % 12;
  return v === 0 ? 12 : v;
}
const currentHour12 = to12(now.getHours());

// Shortest direction around the 1-12 cycle
let diff = targetHour12 - currentHour12;
if (diff > 6) diff -= 12;
if (diff < -6) diff += 12;
output.hourTicks = Math.abs(diff);
output.hourUp = diff >= 0;

const currentIsAM = now.getHours() < 12;
output.ampmTicks = currentIsAM === targetIsAM ? 0 : 1;
output.ampmToAM = targetIsAM;
