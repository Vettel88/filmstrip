// poor mans global state until we maybe need a manager
export default (UIState = {
  appName: 'Filmstrip'
});

if (Meteor.isServer) {
  global.UIState2 = UIState;
} else {
  window.UIState = UIState;
}
