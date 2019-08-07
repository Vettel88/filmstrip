import { Meteor } from 'meteor/meteor'
import React, { Component } from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import { Queues } from '/imports/db/queues.js'

export default class QueuesListItem extends Component {

  render() {
    return (
      <li>{this.props.item.name} ({this.props.item._id})</li>
    );
  }
}
