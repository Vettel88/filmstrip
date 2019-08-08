import React from 'react'
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom"
import Layout from './components/Layout'

import UIState from './UIState.js'
import { QueuesList } from './components/QueuesList.jsx'
import { QueueItem } from './components/QueueItem.jsx'

import 'css-reset-and-normalize/css/reset-and-normalize.min.css'
import 'material-components-web/dist/material-components-web.min.css'

export default App = () =>
    <Router>
        <Layout>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/queueList" component={QueuesList} />
                <Route path="/frameList" component={FrameList} />
                <Route path="/frame" component={Frame} />
                <Route path="/queueitem/:id" component={QueueItem} />
                <Route component={NoMatch} />
            </Switch>
        </Layout>
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
