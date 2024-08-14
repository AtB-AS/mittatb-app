#bi
#!/bin/bash

export APP_FLAVOR=$(if [[ -n "$(envprop KETTLE_API_KEY)" && "$(envprop KETTLE_API_KEY)" != "" ]]; then echo 'beacons'; else echo 'app'; fi)