import React from 'react'
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom"
import 'materialize-css/dist/css/materialize.min.css'
import { Row, Col } from 'react-materialize'
import styled from 'styled-components'

import UIState from './UIState.js'
import { QueuesList } from './components/QueuesList.jsx'
import { QueueItem } from './components/QueueItem.jsx'

export default App = () =>
    <Router>
        <Header />
        <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/queueList" component={QueuesList} />
            <Route path="/frameList" component={FrameList} />
            <Route path="/frame" component={Frame} />
            <Route path="/queueitem/:id" component={QueueItem} />
            <Route component={NoMatch} />
        </Switch>
    </Router>

const Home = () => <h2>Home</h2>
const Frame = ({ match }) => <h3>Requested Param: {match.params.id}</h3>
const FrameList = ({ match }) =>
    <div>
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
    </div>

const Header = () =>
    <Row>
        <Col md="2">
            <ul id="hamburger">
                <li><Link to="/">Dashboard</Link></li>
                <li><Link to="/queueList">QueueList</Link></li>
                <li><Link to="/frameList">FrameList</Link></li>
            </ul>
        </Col>
        <Col md="8">
            <h2>{UIState.name}</h2>
        </Col>
        <Col md="2">
            <div id="userInfo">
                Userinfo
            </div>
        </Col>
    </Row>

const NoMatch = (props) => <div>404 - not your day</div>
