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

import { FilmstripsList } from '/imports/ui/components/FilmstripsList.jsx'
import { FilmstripsItem } from '/imports/ui/components/FilmstripsItem.jsx'
import { FrameVideoRecorder } from '/imports/ui/components/FrameVideoRecorder.jsx'

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
    <Router>
        <Switch>
            <AppRoute exact path="/signUp" component={SignUp} layout={Layout} />
            <AppRoute exact path="/signIn" component={SignIn} layout={Layout} />
            <PrivateRoute exact path="/" component={FilmstripsList} layout={Layout} />
            <PrivateRoute path="/filmstrip/:filmstripId/:frameId" component={FilmstripsItem} layout={Layout} />
            <AppRoute exact path="/a/:id" component={AnswerLanding} layout={AnswerLayout} />
            <AppRoute exact path="/a/:id/:emailBase64" component={AnswerLanding} layout={AnswerLayout} />
            <AppRoute exact path="/a/:id/:emailBase64/q" component={AnswerQuestionnaire} layout={AnswerLayout} />
            <AppRoute exact path="/a/:id/:emailBase64/finish" component={AnswerFinish} layout={AnswerLayout} />
            <AppRoute component={NoMatch} layout={Layout} />
        </Switch>
        <PrivateRoute path="/filmstrip/:filmstripId/:frameId/recordVideo" component={FrameVideoRecorder} layout={ModalLayout} />
    </Router>

const NoMatch = (props) => <div>404 - sorry, nothing found</div>
