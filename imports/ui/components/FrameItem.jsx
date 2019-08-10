import { Meteor } from 'meteor/meteor'
import React from 'react'
import { TextField } from 'rmwc'
import { withTracker } from 'meteor/react-meteor-data'
import { loadingWrapper } from '/imports/ui/UIHelpers.js'

// const FrameItemContent = ({item}) =>
//     <form>
//         {/* TODO: data-length provokes ReferenceError: M is not defined */}
//         {/* <TextInput label="Title" value={item.value} data-length={50}/> */}
//         {/* <Textarea label="Description" data-length={120}/> */}
//         <TextField label="Title" value={item.title} onChange={(v) => console.log(v)}/>
//         <TextField textarea label="Description" value={item.description} onChange={(v) => console.log(v)}/>
        

//     </form>

// const FrameItemWrapper = ({isLoading, item}) => 
//     <ul>
//         {loadingWrapper(isLoading, () => 
//             <FrameItemContent key={item._id} item={item} />)
//         }
//     </ul>

// export const FrameItem = withTracker(({ match }) => {
//     const handle = Meteor.subscribe('Frame', match.params.id)
//     return {
//         isLoading: !handle.ready(),
//         item: Frames.findOne()
//     }
// })(FrameItemWrapper)
