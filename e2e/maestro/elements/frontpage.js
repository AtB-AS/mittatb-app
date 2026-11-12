output.frontpage = {
  scrollView: 'dashboardScrollView',
  closeAnnouncement: 'closeAnnouncement',
  buyTickets: 'buyTicketsButton',
  ticket: {
    fc: fc,
    productName: 'productName',
    isInspectable: 'inspectableIcon',
  },
  favorite: {
    addDeparture: 'addFavoriteDeparture',
    noFavorites: 'noFavoriteWidget',
    departures: 'favoriteDepartures',
    selectDepartures: 'selectFavoriteDepartures',
    stopPlaceTitle: 'stopPlaceTitle',
    line: 'lineItem',
    frontpageLine: frontpageLine,
    frontpageLineTimes: frontpageLineTimes,
    linePublicCode: 'publicCode',
    lineName: 'lineName',
    lineTitle: 'title',
    firstDepartureTime: 'depTime0',
    chooseSheet: 'chooseFavoriteBottomSheetHeader',
    onlySelectedDeparture: 'onlySelectedDeparture',
    selectSheet: 'selectFavoriteBottomSheetHeader',
    toggleVisibility: 'selectFavoriteToggle0',
    edit: 'editButton',
    list: 'favoritesList',
    delete: 'deleteFavorite0',
  },
};

function fc(index) {
  return 'fareContract' + index;
}

function frontpageLine(index) {
  return 'lineItem' + index;
}

function frontpageLineTimes(index) {
  return 'lineItem' + index + 'DepTimes';
}
