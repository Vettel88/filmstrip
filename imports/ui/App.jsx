import React from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import Layout from './components/Layout'
import ModalLayout from './components/ModalLayout'

import { SignUp } from '/imports/ui/components/users/SignUp.jsx'
import { SignIn } from '/imports/ui/components/users/SignIn.jsx'

import AnswerLayout from '/imports/ui/components/answer/AnswerLayout.jsx'
import { AnswerLanding } from '/imports/ui/components/answer/AnswerLanding.jsx'
import { AnswerQuestionnaire } from '/imports/ui/components/answer/AnswerQuestionnaire.jsx'
import { AnswerFinish } from '/imports/ui/components/answer/AnswerFinish.jsx'
import { AnswerSent } from '/imports/ui/components/answer/AnswerSent.jsx'
import { AnswerConfirm } from '/imports/ui/components/answer/AnswerConfirm.jsx'

import { FilmstripsList } from '/imports/ui/components/filmstrips/FilmstripsList.jsx'
import { FilmstripsItemNavigation } from '/imports/ui/components/filmstrips/FilmstripsItemNavigation.jsx'
import { FrameVideoRecorder } from '/imports/ui/components/filmstrips/FrameVideoRecorder.jsx'
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

export default App = () =>
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
                <PrivateRoute path="/filmstrip/:filmstripId/:frameId" component={FilmstripsItemNavigation} layout={Layout} />
                <AppRoute exact path="/a/:id" component={AnswerLanding} layout={AnswerLayout} />
                <AppRoute exact path="/a/:id/:emailBase64" component={AnswerLanding} layout={AnswerLayout} />
                <AppRoute exact path="/a/:id/:emailBase64/q" component={AnswerQuestionnaire} layout={AnswerLayout} />
                <AppRoute exact path="/a/:id/:emailBase64/finish" component={AnswerFinish} layout={AnswerLayout} />
                <AppRoute exact path="/a/:id/:emailBase64/sent" component={AnswerSent} layout={AnswerLayout} />
                <AppRoute exact path="/confirm/:id/:emailBase64" component={AnswerConfirm} layout={AnswerLayout} />
                <AppRoute component={NoMatch} layout={Layout} />
            </Switch>
            <PrivateRoute path="/filmstrip/:filmstripId/:frameId/recordVideo" component={FrameVideoRecorder} layout={ModalLayout} />
        </Router>
    </ThemeProvider>

const NoMatch = (props) => <div>404 - sorry, nothing found</div>
