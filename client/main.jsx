import React from 'react'
import { Meteor } from 'meteor/meteor'
import { render } from 'react-dom'
import App from '/imports/ui/App'
import '/imports/stylesheets/main.less'
import '/imports/i18n/i18n.js'

Meteor.startup(() => {
  render(<App />, document.getElementById('react-target'));
});
