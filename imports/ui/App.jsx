import React from 'react'
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom"
import Layout from './components/Layout'

import UIState from './UIState.js'
import { QueuesList } from './components/QueuesList.jsx'
import { QueueItem } from './components/QueueItem.jsx'
import { SignUp } from '/imports/ui/components/users/SignUp.jsx'
import { SignIn } from '/imports/ui/components/users/SignIn.jsx'

import AnswerLayout from '/imports/ui/components/answer/AnswerLayout.jsx'
import { AnswerLanding } from '/imports/ui/components/answer/AnswerLanding.jsx'
import { AnswerQuestionnaire } from '/imports/ui/components/answer/AnswerQuestionnaire.jsx'

import 'css-reset-and-normalize/css/reset-and-normalize.min.css'
import 'material-components-web/dist/material-components-web.min.css'

const AppRoute = ({ component: RouteComponent, layout: RouteLayout, ...rest }) => (
    <Route {...rest} render={props => (
        <RouteLayout>
            <RouteComponent {...props} />
        </RouteLayout>
    )} />
)

export default App = () =>
    <Router>
        <Switch>
            <AppRoute exact path="/" component={Home} layout={Layout} />
            <AppRoute exact path="/queueList" component={QueuesList} layout={Layout} />
            <AppRoute exact path="/frameList" component={FrameList} layout={Layout} />
            <AppRoute exact path="/frame" component={Frame} layout={Layout} />
            <AppRoute exact path="/signUp" component={SignUp} layout={Layout} />
            <AppRoute exact path="/signIn" component={SignIn} layout={Layout} />
            <AppRoute exact path="/queueitem/:id" component={QueueItem} layout={Layout} />
            <AppRoute exact path="/a/:id" component={AnswerLanding} layout={AnswerLayout} />
            <AppRoute exact path="/a/:id/:emailBase64" component={AnswerLanding} layout={AnswerLayout} />
            <AppRoute exact path="/a/:id/:emailBase64/q" component={AnswerQuestionnaire} layout={AnswerLayout} />
            <AppRoute component={NoMatch} layout={Layout} />
        </Switch>
    </Router>

const Home = () => <h2>Home</h2>
const Frame = ({ match }) => <h3>Requested Param: {match.params.id}</h3>
const FrameList = ({ match }) =>
    <>
        <h2>FrameList</h2>
        <ul>
            <li><Link to={`${match.url}/frame1`}>Frame1</Link></li>
            <li><Link to={`${match.url}/frame2`}>Frame2</Link></li>
        </ul>
        <Route path={`${match.path}/:id`} component={Frame} />
        <Route
            exact
            path={match.path}
            render={() => <h3>Please select a frame.</h3>}
        />
    </>

const NoMatch = (props) => <div>404 - not your day</div>
