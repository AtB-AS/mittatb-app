output.departures = {
    departure: departure
};

output.departure = {
    view: 'departureDetailsContentView',
    publicCode: 'publicCode',
    lineName: 'lineName',
    leg: 'legType_trip',
    quayName: 'quayName',
};

output.nearby = {
    stopPlace: stopPlace,
    stopPlaceName: stopPlaceName
};

function departure(index   = 0) {
    return 'quay' + index + 'CallItem';
}

function stopPlace(index   = 0) {
    return 'stopPlaceItem' + index;
}

function stopPlaceName(index   = 0) {
    return 'stopPlaceItem' + index + 'Name';
}