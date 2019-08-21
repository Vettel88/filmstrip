import { createCollection, createStandardPublications } from './collectionHelpers.js'

// TODO decide if this should be a separate collection or part of a filmstrip
export const Invites = createCollection('Invites')
createStandardPublications(Invites)
