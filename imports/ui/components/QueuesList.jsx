import { Meteor } from 'meteor/meteor'
import React, { Component } from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import { Queues } from '/imports/db/queues.js'

const Foo2 = () => {
    return <div>
        <h1>Hello World!</h1>
        <p>This is my first React Component.</p>
    </div>
}

class MyComponent extends Component{
    render() {
       return <div>
                 <h1>Hello World!</h1>
                 <p>This is my first React Component.</p>
              </div>
       }
 }

export default class QueuesList extends Component {
    // getData() {
    //     Meteor.subscribe('Queues', () => console.log(Queues.find().count()))
    //     console.log(Queues.find().count())
    //     return Queues.find().fetch()
    //   return [
    //     { _id: 1, text: 'This is task 1' },
    //     { _id: 2, text: 'This is task 2' },
    //     { _id: 3, text: 'This is task 3' },
    //   ];
    // }

    // renderQueues() {
    //   return this.getData().map((task) => (
    //   //   <Task key={task._id} task={task} />
    //       <li>{task.text}</li>
    //   ));
    // }

    getData() {
        const handle = Meteor.subscribe('Queues')

        return {
            // currentUser: Meteor.user(),
            listLoading: !handle.ready(),
            queues: Queues.find().fetch(),
        };
    }

    // renderQueues() {
    //     return withTracker(props => {
    //         // Do all your reactive data access in this method.
    //         // Note that this subscription will get cleaned up when your component is unmounted
    //         const handle = Meteor.subscribe('Queues')

    //         return {
    //             currentUser: Meteor.user(),
    //             listLoading: !handle.ready(),
    //             queues: Queues.find().fetch(),
    //         };
    //     })(Foo2);
    // }

    render() {
        return (
            <div>
                <ul>
                    {/* {this.renderQueues()} */}
                    {withTracker(this.getData)(MyComponent)}
                </ul>
            </div>
        );
    }
}
