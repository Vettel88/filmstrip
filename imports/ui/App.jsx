import React from 'react'
import { Meteor } from 'meteor/meteor'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import Layout from './components/layouts/Layout'
import ModalLayout from './components/layouts/ModalLayout'
import FilmstripLayout from './components/layouts/FilmstripLayout'

import { SignUp } from '/imports/ui/components/users/SignUp.jsx'
import { SignIn } from '/imports/ui/components/users/SignIn.jsx'

import { ResponseLayout } from '/imports/ui/components/response/ResponseCommon.jsx'
import { ResponseLanding } from '/imports/ui/components/response/ResponseLanding.jsx'
import { ResponseQuestionnaire } from '/imports/ui/components/response/ResponseQuestionnaire.jsx'
import { ResponseFinish, ResponseConfirm } from '/imports/ui/components/response/ResponseFinish.jsx'

import { FilmstripsList } from '/imports/ui/components/filmstrips/FilmstripsList.jsx'
import { FilmstripsSettings } from '/imports/ui/components/filmstrips/FilmstripsSettings.jsx'
import { FilmstripsItem } from '/imports/ui/components/filmstrips/FilmstripsItem.jsx'
import { InvitesList } from '/imports/ui/components/filmstrips/InvitesList.jsx'
import { InvitesRespondedList } from '/imports/ui/components/filmstrips/InvitesRespondedList.jsx'
import { FrameVideoRecorder } from '/imports/ui/components/filmstrips/FrameVideoRecorder.jsx'
import { ResponseVideoRecorder } from '/imports/ui/components/response/ResponseVideoRecorder.jsx'
import { ThemeProvider } from 'rmwc'

import 'css-reset-and-normalize/css/reset-and-normalize.min.css'
import 'material-components-web/dist/material-components-web.min.css'

const AppRoute = ({ component: RouteComponent, layout: RouteLayout, ...rest }) => (
    <Route {...rest} render={props => (
        <RouteLayout>
            <RouteComponent {...props} />
        </RouteLayout>
    )} />
)

const PrivateRoute = ({ component: RouteComponent, layout: RouteLayout, ...rest }) =>
    <Route {...rest} render={(props) => (
        Meteor.userId()
            ? <RouteLayout><RouteComponent {...props} /></RouteLayout> 
            : <Redirect to='/signIn' />
    )} />

const App = () =>
    <ThemeProvider
        options={{
            'primary': '#1c5784',
            'secondary': '#37474f',
            'error': 'red',
            'background': '#eeeeee',
            'surface': 'white',
            'primaryBg': '#1c5784',
            'secondaryBg': '#37474f',
            'textPrimaryOnBackground': '#333333',
            'textSecondaryOnBackground': '#666666',
            'textHintOnBackground': '#999999',
            'textDisabledOnBackground': '#999999',
            'textIconOnBackground': '#ffffff',
            'textPrimaryOnLight': '#ffffff',
            'textSecondaryOnLight': '#ffffff',
            'textHintOnLight': '#ffffff',
            'textDisabledOnLight': '#ffffff',
            'textIconOnLight': '#ffffff'
        }}
    >

        <Router>
            <Switch>
                <AppRoute exact path="/signUp" component={SignUp} layout={Layout} />
                <AppRoute exact path="/signIn" component={SignIn} layout={Layout} />
                <PrivateRoute exact path="/" component={FilmstripsList} layout={Layout} />
                <AppRoute exact path="/a/:filmstripId" component={ResponseLanding} layout={ResponseLayout} />
                <AppRoute exact path="/a/:filmstripId/:emailBase64" component={ResponseLanding} layout={ResponseLayout} />
                <AppRoute exact path="/a/:filmstripId/:emailBase64/:createdFilmstripId/finish" component={ResponseFinish} layout={ResponseLayout} />
                <AppRoute exact path="/confirm/:createdFilmstripId/:emailBase64/:confirmationKey" component={ResponseConfirm} layout={ResponseLayout} />
                <PrivateRoute path="/filmstrip/:filmstripId/:frameId/settings" component={FilmstripsSettings} layout={FilmstripLayout} />
                <PrivateRoute path="/filmstrip/:filmstripId/:frameId/frames" component={FilmstripsItem} layout={FilmstripLayout} />
                <PrivateRoute path="/filmstrip/:filmstripId/:frameId/invites" component={InvitesList} layout={FilmstripLayout} />
                <PrivateRoute path="/filmstrip/:filmstripId/:frameId/responded" component={InvitesRespondedList} layout={FilmstripLayout} />
                <AppRoute path="/response/:filmstripId/:frameId/:emailBase64" component={ResponseQuestionnaire} layout={ResponseLayout} />
                <AppRoute component={NoMatch} layout={Layout} />
            </Switch>
            <PrivateRoute path="/filmstrip/:filmstripId/:frameId/recordVideo" component={FrameVideoRecorder} layout={ModalLayout} />
            <AppRoute path="/response/:filmstripId/:frameId/:emailBase64/recordVideo" component={ResponseVideoRecorder} layout={ModalLayout} />
        </Router>
    </ThemeProvider>

const NoMatch = (_props) => <div>404 - sorry, nothing found</div>

export default App