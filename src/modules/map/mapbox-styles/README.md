# How to update a style from Mapbox

## Good to know before beginning

A mapbox style basically needs

- sources (for data on the map)
- layers (defines how to draw data)
- glyphs (font source to display text)
- sprite (image source to display icons)

In order to support interactivity related to state, layer styles must be controlled frontend side. Everything defined in the style in Mapbox Studio is static. Layer styling can be controlled with [Style Expressions](https://docs.mapbox.com/style-spec/reference/expressions/).

We have decided to store Mapbox styles locally, and fetch sprites remotely. Some background for this:

- The local `<MapboxGL.Images />` component is buggy.
- Mapbox Studio has issues:
  - Can only upload SVGs, but some white backgrounds are rendered black.
  - Shadows don't work.
  - All OMS partners need to maintain duplicate versions of style and images in the cloud. Can easily result in bugs/inconsistencies.
- styleJson requires a sprite url. If it accepted spriteJson, we probably would have gone with that as a local solution instead.

## 1. Update the style in [Mapbox Studio](http://studio.mapbox.com/).

## 2. Download the new style using [Mapbox Styles API](https://docs.mapbox.com/api/maps/styles/#retrieve-a-style).

```
curl "https://api.mapbox.com/styles/v1/MAPBOX_USER_NAME/STYLE_URL_ID?access_token=PUBLIC_ACCESS_TOKEN"
```

## 3. Get the style without any cluttering props.

```js
const styleFromMapbox = ... // paste mapbox style object from curl response here

const visibleLayersWithoutMetadata = styleFromMapbox.layers
    .filter(layer => layer?.layout?.visibility !== 'none')
    .map(layer => {
        const {metadata, ...layerPropsToKeep} = layer
        return layerPropsToKeep // metadata is unnecessary
    });

copy({
    sources: styleFromMapbox.sources,
    glyphs: styleFromMapbox.glyphs,
    layers: visibleLayersWithoutMetadata
})
```

Paste it in the mapbox style files. Then make sure to use env variables for sources and glyphs (very likely that you just want to discard the changes to sources and glyphs):

```ts
sources: {
    composite: {
        url: `mapbox://mapbox.mapbox-terrain-v2,mapbox.mapbox-streets-v8,${MAPBOX_USER_NAME}.${MAPBOX_NSR_TILESET_ID}`,
        type: 'vector',
    },
},
glyphs: `mapbox://fonts/${MAPBOX_USER_NAME}/{fontstack}/{range}.pbf`,
```

Note: `sprite` is dynamically added in `useMapboxJsonStyle`, instead of here.

## 5. Sanity checks.

- Update "Based on" comment at the top of the file.
- Make sure to update and test both light and dark mode.
- Be aware of potentially cached data when testing and developing.
- If any new icons are to be used, see Sprites below.

## Sprites

For icon changes, check out the [map-sprites](https://github.com/AtB-AS/map-sprites) repo.

Final sprite assets required:

- `light@2x.png`
- `light@2x.json`
- `light.png`
- `light.json`
  <br /><br />
- `dark@2x.png`
- `dark@2x.json`
- `dark.png`
- `dark.json`

These should be statically hosted.
To use the new sprites, update `mapboxSpriteUrl` in the [firestore-configuration](https://github.com/AtB-AS/firestore-configuration) repo.
