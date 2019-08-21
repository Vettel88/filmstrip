import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { Frames } from './frames.js'

import {
    createCollection,
    createStandardPublications
} from './collectionHelpers.js';

export const Filmstrips = createCollection('Filmstrips')

if (Meteor.isServer) {
    Meteor.publish('Filmstrips', function () {
        if (!this.userId) return this.ready()
        return Filmstrips.find({createdBy: this.userId})
    })
    Meteor.publish('Filmstrip', function (_id) {
        check([_id], [String])
        if (!this.userId) return this.ready()
        return [
            Filmstrips.find({ _id }),
            Frames.find({ filmstripId: _id }),
        ]
    })
    Meteor.publish('ResponseFilmstrip', function (_id) {
        check([_id], [String])
        return [
            Filmstrips.find({ _id: _id, live: true }),
            Frames.find({ filmstripId: _id })
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
