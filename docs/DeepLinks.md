# Deep links

The app has support for deep links to open specific screens, with the prefix `atb://` for the AtB app, `fram://` for FRAM, `nfk://` for Reis Nordland, and `troms://` for Svipper. The implementation lives in [`src/modules/deep-links`](../src/modules/deep-links).

## Available deep links

| Link                | Params                                                   | Opens                          |
| ------------------- | -------------------------------------------------------- | ------------------------------ |
| `profile`           | None                                                     | Profile tab                    |
| `ticketing`         | None                                                     | Ticketing tab, valid tickets   |
| `map`               | `formFactor`                                             | Map tab                        |
| `purchase-overview` | `type`                                                   | Purchase overview              |
| `departures`        | `stopId`, `quayId`                                       | Departures for a stop place    |
| `trip-search`       | `fromId`, `fromLat`, `fromLon`, `toId`, `toLat`, `toLon` | Travel search with from/to set |

### `map`

Opens the map, with optional pre-selected form factor filter.

- `formFactor`: Comma separated list of mobility form factors. Currently `scooter`, `bicycle` and `car` is supported.

Example: `atb://map?formFactor=scooter,bicycle`

### `purchase-overview`

Opens the screen for purchasing a specific ticket.

- `type`: fare product type from the app configuration, e.g. `single` or `period`

Example: `atb://purchase-overview?type=period`

### `departures`

- `stopId`: NSR stop place id.
- `quayId`: NSR quay id to preselect.

Go to [Entur Stoppestedsregister](https://stoppested.entur.org/) to look up stop place and quay ids.

Example: `atb://departures?stopId=NSR:StopPlace:41613&quayId=NSR:Quay:71184`

### `trip-search`

Opens a trip search with the given from/to locations. Locations can be either NSR IDs or coordinates that will be reverse-geocoded by the app.

- `fromId` / `toId`: NSR ID
- `fromLat` + `fromLon` / `toLat` + `toLon`: coordinates in decimal degrees.

Example: `atb://trip-search?fromLat=63.4326&fromLon=10.3951&toId=NSR:StopPlace:59872`
