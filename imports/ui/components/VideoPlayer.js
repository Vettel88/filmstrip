import React from "react"
import { Video } from "cloudinary-react"
import windowSize from "react-window-size"
const { cloudName } = Meteor.settings.public.cloudinary

const VideoPlayer = ({ publicId, showControls, windowWidth }) => (
    <Video
        cloudName={cloudName}
        publicId={publicId}
        controls={showControls}
        width={0.8 * windowWidth}
    />
);
export default windowSize(VideoPlayer);
