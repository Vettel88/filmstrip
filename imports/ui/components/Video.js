import { Meteor } from 'meteor/meteor'
import PropTypes from 'prop-types'
import React from 'react'

import windowSize from 'react-window-size'
const { cloudName } = Meteor.settings.public.cloudinary

class Video extends React.Component {
    _cloudinaryURL = extension =>
        `http://res.cloudinary.com/${cloudName}/video/upload/v1/${this.props.publicId}.${extension}`

    render() {
        const {
            publicId,
            showControls = true,
            width,
            windowWidth,
            onPlaying = console.log,
            onStopped = console.log,
            ...rest
        } = this.props
        return (
            <video
                key={publicId}
                controls
                playsInline
                onPlaying={onPlaying}
                onPause={onStopped}
                onEnded={onStopped}
                showControls={showControls}
                width={width || 0.8 * windowWidth}
                poster={this._cloudinaryURL('jpg')}
                {...rest}>
                <source src={this._cloudinaryURL('webm')} type='video/webm' />
                <source src={this._cloudinaryURL('mp4')} type='video/mp4' />
                <source src={this._cloudinaryURL('ogv')} type='video/ogv' />
            </video>
        )
    }
}

Video.propTypes = {
    publicId: PropTypes.string,
    showControls: PropTypes.bool,
    width: PropTypes.any,
    windowWidth: PropTypes.any,
    onPlaying: PropTypes.func,
    onStopped: PropTypes.func
}

export default windowSize(Video)
