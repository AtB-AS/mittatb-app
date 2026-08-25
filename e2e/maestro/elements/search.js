output.search = {
    from: 'searchFromButton',
    to: 'searchToButton',
    input: 'locationSearchInput',
    resultItem: resultItem,
    onlyStopPlaces: 'onlyStopPlacesCheckbox'
}

function resultItem(index = 0) {
    return 'locationSearchItem' + index;
}