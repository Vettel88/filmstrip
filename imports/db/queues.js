import { createCollection, createStandardPublications } from './collectionHelpers.js'

// A queue holds together different frames (think presentation)
export const Queues = createCollection('Queues')

createStandardPublications(Queues)
