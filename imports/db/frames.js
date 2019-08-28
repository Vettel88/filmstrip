import {
  createCollection,
  createStandardPublications
} from './collectionHelpers.js'

export const Frames = createCollection('Frames')
createStandardPublications(Frames)

// Fields:
// filmstripId - reference
// no - order in filmstrip
// title
// description
// link (optional)
