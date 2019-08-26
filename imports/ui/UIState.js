import { Meteor } from 'meteor/meteor'

let UIState
export default (UIState = {
  appName: 'Filmstrip'
})

if (Meteor.isServer) {
  global.UIState2 = UIState;
} else {
  window.UIState = UIState;
}
