# Configuration for different organizations

## App schema

App schemas are used for handling redirect after buying tickets and for general deep linking. To override app schema based on organisation have a `env` file in `./env` in the corresponding enviroment (dev, staging, store) specify env.var `APP_SCHEMA`. Example:

```
APP_SCHEMA=abt-staging
```

After changing the `APP_SCHEMA` you should run setup again. Example:

```
yarn setup staging atb
```

### Testing schema

Verify setup and schema using:

```
npx uri-scheme open 'atb-staging://ticketing?transaction_id=321321&payment_id=321321' --android
```

```
npx uri-scheme open 'atb-staging://ticketing?transaction_id=321321&payment_id=321321' --ios
```

This should open "Active tickets" tab in the app.
