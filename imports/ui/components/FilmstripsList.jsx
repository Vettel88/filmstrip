import { Meteor } from 'meteor/meteor'
import React from 'react'
import { Link } from "react-router-dom"
import { withTracker } from 'meteor/react-meteor-data'
import { Filmstrips } from '/imports/db/filmstrips.js'
import { loadingWrapper } from '/imports/ui/UIHelpers.js'

const ListItem = ({item}) =>     
    <li>
        <Link to={`/filmstrip/${item._id}`}>{item.name} ({item._id})</Link>
    </li>

const ListWrapper = ({isLoading, items}) => 
    <div>
        <ul>
            {loadingWrapper(isLoading, () => 
                items.map(item => <ListItem key={item._id} item={item} />))
            }
        </ul>
    </div>

export const FilmstripsList = withTracker(() => {
    const handle = Meteor.subscribe('Filmstrips')
    return {
        isLoading: !handle.ready(),
        items: Filmstrips.find().fetch()
    }
})(ListWrapper)
