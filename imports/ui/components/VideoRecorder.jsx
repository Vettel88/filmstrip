import React from "react"
import VR from "react-video-recorder"
import { isSafari, isIOS } from "react-device-detect"
import cloudinary from "../../services/cloudinary"

export class VideoRecorder extends React.Component {
    onSuccess(){
        throw new Error("You must define an onSuccess handler.")
    }
    onError(error){
        console.warn("VideoRecorder Error: ", error)
    }
    render() {
        console.log('props', this.props)
        const { onError, onSuccess } = this.props
        const handleSuccess = onSuccess || this.onSuccess
        const handleError = onError || this.onError
        return (
            <VR
                isOnInitially={true}
                isReplayVideoMuted={true}
                useVideoInput={isIOS && !isSafari}
                onRecordingComplete={blob =>
                    cloudinary.uploadVideo(blob)
                        .then(json => handleSuccess(json))
                        .catch(error => handleError(error))
                }
            />
        );
    }
}
