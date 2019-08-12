import React from "react"
import VR from "react-video-recorder"
import { isSafari, isIOS } from "react-device-detect"
import cloudinary from "../../services/cloudinary"

export class VideoRecorder extends React.Component {
    render() {
        return (
            <VR
                isOnInitially={true}
                isReplayVideoMuted={true}
                useVideoInput={isIOS && !isSafari}
                onRecordingComplete={blob => cloudinary.uploadVideo(blob)}
            />
        );
    }
}
