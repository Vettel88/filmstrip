import React from 'react'
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'
import { List, ListItem } from '@rmwc/list'
import Layout from './components/Layout'

import UIState from './UIState.js'
import { Filmstrip } from './components/Filmstrip.jsx'
import { Hello } from './components/Hello.jsx'
import { QueuesList } from './components/QueuesList.jsx'
import { QueueItem } from './components/QueueItem.jsx'
import { SignUp } from '/imports/ui/components/users/SignUp.jsx'
import { SignIn } from '/imports/ui/components/users/SignIn.jsx'

import AnswerLayout from '/imports/ui/components/answer/AnswerLayout.jsx'
import { AnswerLanding } from '/imports/ui/components/answer/AnswerLanding.jsx'

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
            <AppRoute exact path="/filmstrip" component={Filmstrip} layout={Layout} />
            <AppRoute exact path="/frame" component={Frame} layout={Layout} />
            <AppRoute exact path="/signUp" component={SignUp} layout={Layout} />
            <AppRoute exact path="/signIn" component={SignIn} layout={Layout} />
            <AppRoute exact path="/queueitem/:id" component={QueueItem} layout={Layout} />
            <AppRoute exact path="/a/:id" component={AnswerLanding} layout={AnswerLayout} />
            <AppRoute component={NoMatch} layout={Layout} />
        </Switch>
    </Router>

const Home = () => <h2>Home</h2>

const NoMatch = (props) => <div>404 - not your day</div>
