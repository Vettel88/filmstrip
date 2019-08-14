import React, { Component } from "react"
import ReactVideoRecorder from "react-video-recorder"
import Timer from './Timer'
import Countdown from './Countdown'
import { Button as Btn } from 'rmwc'
import { isSafari, isIOS } from "react-device-detect"
import cloudinary from "../../../services/cloudinary"
import styled from 'styled-components'

const Button = styled(Btn)`
    color: #6200EE !important;
    background-color: white !important;
`

const ActionsWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 20px;
  padding-bottom: 80px;
`

class Actions extends Component {

    renderUseVideoInput = () => {
        if (this.props.useVideoInput) {
          return (
            <Button onClick={this.props.onOpenVideoInput} data-qa='open-input'>
              Upload a video
            </Button>
          )
        }
    }

    renderIsRecording = () => {
        if (this.props.isRecording) {
            return (
                <Button onClick={this.props.onStopRecording} data-qa='stop-recording'>
                    Stop Recording
                </Button>
            )
        } else {
            return <div></div>
        }
    }

    renderTimer = () => {
        if (this.props.isRecording) return <Timer timeLimit={this.props.timeLimit} />
    }

    renderIsReadyToRecord = () => {
        if (this.props.isCameraOn && this.props.streamIsReady && !this.props.isRecording && !this.props.isRunningCountdown) {
          return (
            <Button onClick={this.props.onStartRecording} data-qa='start-recording'>
                Start Recording
            </Button>
          )
        }
    }

    render() {
        const {
            isVideoInputSupported,
            isInlineRecordingSupported,
            thereWasAnError,
            isConnecting,
        } = this.props
        if (
            (!isInlineRecordingSupported && !isVideoInputSupported) ||
            thereWasAnError ||
            isConnecting
        ) {
            return <div></div>
        }
        return (
            <div>
                {this.props.isRunningCountdown && <Countdown countdownTime={this.props.countdownTime} />}
                {this.renderTimer()}
                <ActionsWrapper>
                    {this.renderIsRecording()}
                    {this.renderIsReadyToRecord()}
                    {this.renderUseVideoInput()}
                </ActionsWrapper>
            </div>
        );
    }
}


export default class VideoRecorder extends React.Component {
    onSuccess = () => {
        throw new Error("You must define an onSuccess handler.")
    }
    onError = (error) => {
        console.warn("VideoRecorder Error: ", error)
    }

    render() {
        const { onError, onSuccess } = this.props
        const handleSuccess = onSuccess || this.onSuccess
        const handleError = onError || this.onError
        return (
            <ReactVideoRecorder
                isOnInitially={true}
                isReplayVideoMuted={true}
                useVideoInput={isIOS && !isSafari}
                renderActions={(props) => <Actions {...props} />}
                onRecordingComplete={blob =>
                    cloudinary.uploadVideo(blob)
                        .then(json => handleSuccess(json))
                        .catch(error => handleError(error))
                }
            />
        );
    }
}

