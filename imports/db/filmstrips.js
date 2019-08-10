import { createCollection, createStandardPublications } from './collectionHelpers.js'

export const Filmstrips = createCollection('Filmstrips')
createStandardPublications(Filmstrips)

// # Frames / Slides
// Required fields:
// Name - String
// Type (outbound/inbound) - String
// Video - record/replace button and field will hold video path. Also will display keyframe image.
// Optional Fields
// Desc - String
// Link - String
// File (path to file) 
