import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { Frames } from './frames.js'

import {
    createCollection,
    createStandardPublications
} from './collectionHelpers.js';

export const Filmstrips = createCollection('Filmstrips')
// createStandardPublications(Filmstrips)

if (Meteor.isServer) {
    Meteor.publish('Filmstrips', () => Frames.find())
    Meteor.publish('Filmstrip', function (_id) {
        check([_id], [String])
        // TODO active when accounting works
        // if (!this.userId) return this.ready()
        return [
            Filmstrips.find({ _id }),
            Frames.find({ filmstripId: _id }),
        ]
    })
}

// # Frames / Slides
// Required fields:
// Name - String
// Type (outbound/inbound) - String
// Video - record/replace button and field will hold video path. Also will display keyframe image.
// Optional Fields
// Desc - String
// Link - String
// File - Array of Url/Filename Objects
