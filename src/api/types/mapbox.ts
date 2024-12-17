import {z} from 'zod';

// Define the Metadata schema
const MetadataSchema = z
  .object({
    'mapbox:type': z.string(),
    'mapbox:origin': z.string(),
    'mapbox:autocomposite': z.boolean(),
    'mapbox:groups': z.record(z.any()), // Adjust based on actual structure
    'mapbox:sdk-support': z.object({
      js: z.string(),
      android: z.string(),
      ios: z.string(),
    }),
    // Include other metadata fields as necessary
  })
  .passthrough(); // Allows additional unspecified fields

// Define the Light schema
const LightSchema = z.object({
  color: z.string(),
});

// Define the Sources schema
const SourceSchema = z.object({
  url: z.string(),
  type: z.string(),
});

const SourcesSchema = z.object({
  composite: SourceSchema,
});

// Define the Style schema
export const MapboxStyleSchema = z
  .object({
    bearing: z.number(),
    center: z.tuple([z.number(), z.number()]),
    created: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid date format',
    }),
    draft: z.boolean(),
    glyphs: z.string(),
    id: z.string(),
    layers: z.array(z.any()), // Ideally, define a detailed Layer schema
    light: LightSchema,
    metadata: MetadataSchema,
    modified: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid date format',
    }),
    name: z.string(),
    owner: z.string(),
    pitch: z.number(),
    protected: z.boolean(),
    sources: SourcesSchema,
    sprite: z.string(),
    version: z.number(),
    visibility: z.string(),
    zoom: z.number(),
  })
  .passthrough(); // Allows additional unspecified fields

export type MapboxStyle = z.infer<typeof MapboxStyleSchema>;
