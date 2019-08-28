import { Meteor } from 'meteor/meteor'
import {
  createCollection,
  createStandardPublications
} from './collectionHelpers.js'

// TODO decide if this should be a separate collection or part of a filmstrip
export const Invites = createCollection('Invites')
createStandardPublications(Invites)

if (Meteor.isServer) {
  Meteor.startup(() => {
    const options = { background: true, unique: true }
    Invites.rawCollection().createIndex({ email: 1 }, options)
  })
}
