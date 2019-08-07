import React from 'react'
import { QueuesList } from './components/QueuesList.jsx'
import { BrowserRouter as Router, Route, Link } from "react-router-dom"
import UIState from './UIState.js'
// import './App.less'
// import 'muicss/dist/css/mui.css'
import styled from 'styled-components'
// import Container from 'muicss/lib/react/container'
// import Row from 'muicss/lib/react/row'
// import Col from 'muicss/lib/react/col'
// require('muicss/react')
import 'materialize-css/dist/css/materialize.min.css'
import { Row, Col } from 'react-materialize'


export default App = () =>
    <Router>
        <div>
            <Header2 />
            <Route exact path="/" component={Home} />
            <Route path="/queueList" component={QueuesList} />
            <Route path="/queue" component={Queue} />
            <Route path="/frameList" component={FrameList} />
            <Route path="/frame" component={Frame} />
        </div>
    </Router>

const Home = () => <h2>Home</h2>
const Queue = () => <h2>Queue</h2>
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

const Header2 = () =>
    <Row>
        <Col md="2">
            <ul id="hamburger">
                <li><Link to="/">Dashboard</Link></li>
                <li><Link to="/queueList">QueueList</Link></li>
                <li><Link to="/queue">Queue</Link></li>
                <li><Link to="/frameList">FrameList</Link></li>
                <li><Link to="/frame">Frame</Link></li>
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
