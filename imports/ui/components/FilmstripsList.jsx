import { Meteor } from 'meteor/meteor'
import React from 'react'
import { Link } from "react-router-dom"
import { withTracker } from 'meteor/react-meteor-data'
import { Filmstrips } from '/imports/db/filmstrips.js'
import { Frames } from '/imports/db/frames.js'
import { loadingWrapper } from '/imports/ui/UIHelpers.js'

const ListItem = ({filmstrip}) => {
    const frame = Frames.findOne({ filmstripId: filmstrip._id, no: 1 })
    const frameId = frame._id
    return <li>
        <Link to={`/filmstrip/${filmstrip._id}/${frameId}`}>{filmstrip.name}</Link>
    </li>
}

const ListWrapper = ({isLoading, filmstrips}) => 
    <div>
        <ul>
            {loadingWrapper(isLoading, () => 
                filmstrips.map(filmstrip => <ListItem key={filmstrip._id} filmstrip={filmstrip} />))
            }
        </ul>
    </div>

export const FilmstripsList = withTracker(() => {
    const handle = Meteor.subscribe('Filmstrips')
    // TODO add subscribtion to only get the _id of the first frame
    const handleFrames = Meteor.subscribe('Frames')
    return {
        isLoading: !handle.ready() || !handleFrames.ready(),
        filmstrips: Filmstrips.find().fetch()
    }
})(ListWrapper)
