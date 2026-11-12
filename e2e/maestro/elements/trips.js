output.tripSearch = {
  filterButton: 'filterButton',
  busLeg: 'busLeg',
  railLeg: 'railLeg',
  bikeResult: 'bicycleResult',
  walkResult: 'footResult',
  firstResult: 'tripSearchSearchResult0',
  result: result,
  timePicker: 'dashboardDateTimePicker',
  leaveAt: 'leaveatButton',
  arriveBy: 'arrivebyButton',
  duration: 'resultDuration',
  time: time,
  aimedTime: aimedTime,
};

output.tripFilter = {
  view: 'filterView',
  toggle: toggle,
};

output.tripDetails = {
  content: 'tripDetailsContentView',
  duration: 'resultDuration',
  firstLegFrom: 'leg0FromPlace',
  aimedTime: 'aimTime',
  scheduledTime: 'schTime',
};

function result(index) {
  return 'tripSearchSearchResult' + index;
}

// Start - end time of a result, e.g. '08:15 - 08:45'
function time(index) {
  return result(index) + 'Time';
}

// Original start - end time of a result. Only shown if it differs from the expected time
function aimedTime(index) {
  return result(index) + 'AimedTime';
}

// Transport mode toggle in the filter, e.g. 'bus' or 'allModes'
function toggle(type) {
  return type + 'Toggle';
}
