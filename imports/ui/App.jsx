import React from 'react'
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'
import { List, ListItem } from '@rmwc/list'
import Layout from './components/Layout'

import { SignUp } from '/imports/ui/components/users/SignUp.jsx'
import { SignIn } from '/imports/ui/components/users/SignIn.jsx'
import { FilmstripsList } from './components/FilmstripsList.jsx'
import { FilmstripsItem } from './components/FilmstripsItem.jsx'
import { Filmstrip } from './components/Filmstrip.jsx'
// import AnswerLayout from '/imports/ui/components/answer/AnswerLayout.jsx'
// import { AnswerLanding } from '/imports/ui/components/answer/AnswerLanding.jsx'

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
        <Layout>
            <Switch>
                {/* <AppRoute exact path="/" component={Home}  layout={Layout}/>
                <AppRoute path="/filmstrips" component={FilmstripsList}  layout={Layout}/>
                <AppRoute path="/filmstrip/:filmstripId" component={FilmstripsItem}  layout={Layout}/> */}
                {/* <AppRoute path="/filmstrip/:filmstripId/frame/:frameNo" component={FrameItem} /> */}
                {/* <AppRoute path="/signUp" component={SignUp}  layout={Layout}/>
                <AppRoute path="/signIn" component={SignIn}  layout={Layout}/> */}
                {/* <AppRoute exact path="/a/:id" component={AnswerLanding} layout={AnswerLayout} /> */}
                {/* <AppRoute component={NoMatch} layout={Layout}  layout={Layout}/> */}
                <Route exact path="/" component={Home}  layout={Layout}/>
                <Route path="/filmstrips" component={FilmstripsList}  layout={Layout}/>
                <Route path="/filmstrip/:filmstripId" component={FilmstripsItem}  layout={Layout}/>
                {/* <AppRoute path="/filmstrip/:filmstripId/frame/:frameNo" component={FrameItem} /> */}
                <Route path="/signUp" component={SignUp}  layout={Layout}/>
                <Route path="/signIn" component={SignIn}  layout={Layout}/>
                <Route exact path="/filmstrip" component={Filmstrip} layout={Layout} />
                {/* <AppRoute exact path="/a/:id" component={AnswerLanding} layout={AnswerLayout} /> */}
                <Route component={NoMatch} layout={Layout}  layout={Layout}/>
            </Switch>
        </Layout>
    </Router>

// const Home = () => <h2>Home</h2>
//         <Switch>
//             <AppRoute exact path="/" component={Home} layout={Layout} />
//             <AppRoute exact path="/queueList" component={QueuesList} layout={Layout} />
//             <AppRoute exact path="/filmstrip" component={Filmstrip} layout={Layout} />
//             <AppRoute exact path="/signUp" component={SignUp} layout={Layout} />
//             <AppRoute exact path="/signIn" component={SignIn} layout={Layout} />
//             <AppRoute exact path="/queueitem/:id" component={QueueItem} layout={Layout} />
//             <AppRoute exact path="/a/:id" component={AnswerLanding} layout={AnswerLayout} />
//             <AppRoute component={NoMatch} layout={Layout} />
//         </Switch>
//     </Router>

const Home = () => <h2>Home</h2>

const NoMatch = (props) => <div>404 - not your day</div>
