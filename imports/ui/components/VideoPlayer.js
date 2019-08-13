import React from "react"
import { Video } from "cloudinary-react"
import windowSize from "react-window-size"
const { cloudName } = Meteor.settings.public.cloudinary

export default VideoPlayer = ({ publicId, showControls=true, width, windowWidth }) =>
    (<Video
        cloudName={cloudName}
        publicId={publicId}
        controls={showControls}
        width={width || windowWidth * 0.8}
    />)

// export default windowSize(VideoPlayer)
