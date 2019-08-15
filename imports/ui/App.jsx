import React from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import Layout from './components/Layout'

import { SignUp } from '/imports/ui/components/users/SignUp.jsx'
import { SignIn } from '/imports/ui/components/users/SignIn.jsx'

import AnswerLayout from '/imports/ui/components/answer/AnswerLayout.jsx'
import { AnswerLanding } from '/imports/ui/components/answer/AnswerLanding.jsx'
import { AnswerQuestionnaire } from '/imports/ui/components/answer/AnswerQuestionnaire.jsx'
import { AnswerFinish } from '/imports/ui/components/answer/AnswerFinish.jsx'

import { FilmstripsList } from './components/FilmstripsList.jsx'
import { FilmstripsItem } from './components/FilmstripsItem.jsx'
import { Filmstrip } from './components/Filmstrip.jsx'
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
            <AppRoute exact path="/" component={Home} layout={Layout} />
            <AppRoute exact path="/signUp" component={SignUp} layout={Layout} />
            <AppRoute exact path="/signIn" component={SignIn} layout={Layout} />
            <PrivateRoute path="/filmstrips" component={FilmstripsList} layout={Layout} />
            <PrivateRoute path="/filmstrip/:filmstripId/:frameId" component={FilmstripsItem} layout={Layout} />
            <PrivateRoute exact path="/filmstrip/:filmstripId/:frameId/recordVideo" component={FrameVideoRecorder} layout={AnswerLayout} />
            <PrivateRoute exact path="/recordVideo/:filmstripId/:frameId" component={FrameVideoRecorder} layout={AnswerLayout} />
            <AppRoute exact path="/a/:id" component={AnswerLanding} layout={AnswerLayout} />
            <AppRoute exact path="/a/:id/:emailBase64" component={AnswerLanding} layout={AnswerLayout} />
            <AppRoute exact path="/a/:id/:emailBase64/q" component={AnswerQuestionnaire} layout={AnswerLayout} />
            <AppRoute exact path="/a/:id/:emailBase64/finish" component={AnswerFinish} layout={AnswerLayout} />
            <AppRoute component={NoMatch} layout={Layout} />
        </Switch>
    </Router>

const Home = () => <h2>Home</h2>

const NoMatch = (props) => <div>404 - sorry, nothing found</div>
