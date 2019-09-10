import { Button, Typography } from 'rmwc'
import React, { useState } from 'react'
import { BigButton } from './Forms.jsx'
import { PaginationIndicator } from '/imports/ui/components/Lists.jsx'
import PropTypes from 'prop-types'
import Video from '/imports/ui/components/Video.js'
import styled from 'styled-components'

const UnstyledEmptyVideo = ({ ...rest }) => (
    <div {...rest}>
        <Typography tag='p' use='caption'>
            No video
        </Typography>
    </div>
)

const EmptyVideo = styled(UnstyledEmptyVideo)`
    border: 1px solid #ccc;
    max-width: 480px;
    height: 360px;
    display: flex;
    justify-content: center;
    align-items: center;

    @media (max-width: 479px) {
        height: 240px;
    }

    p {
        font-size: 16px;
        color: #999;
        text-align: center;
    }
`

const VideoContainer = styled('div')`
    display: block;
    position: relative;
    max-width: 480px;
    margin: 0 auto;
`

const PreviousButton = styled(Button)`
    background-color: var(--mdc-theme-primary) !important;
    box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.24);
    color: white !important;
    border: 1px solid rgba(0, 0, 0, 0.24) !important;
    border-radius: 50% !important;
    padding: 0 !important;
    margin-top: -24px;
    min-width: auto !important;
    width: 48px;
    height: 48px !important;
    position: absolute !important;
    text-align: center !important;
    top: 50%;
    left: -60px;
    z-index: 2;

    @media (max-width: 479px) {
        left: -24px;
    }

    i {
        margin: 0 !important;
    }

    :disabled {
        background-color: #666 !important;
    }
`

const NextButton = styled(PreviousButton)`
    left: auto;
    right: -60px;

    @media (max-width: 479px) {
        left: auto;
        right: -24px;
    }
`

const StyledVideo = styled(Video)`
    max-width: 480px;
    display: block;
    margin: 0 auto;
`

const VideoPlayerContainer = styled('div')`
    position: relative;
`

export const VideoPlayer = ({
    currentFrame,
    currentFrameIndex,
    numberOfFrames,
    onPlaying,
    onClickNext,
    onClickPrevious,
    onStopped,
    onRecord
}) => (
    <VideoPlayerContainer>
        <VideoContainer>
            <PreviousButton
                disabled={currentFrameIndex === 0}
                onClick={onClickPrevious}
                icon='keyboard_arrow_left'
            />
            {currentFrame && currentFrame.cloudinaryPublicId ? (
                <StyledVideo
                    publicId={currentFrame.cloudinaryPublicId}
                    onPlaying={onPlaying ? onPlaying : undefined}
                    onStopped={onStopped ? onStopped : undefined}
                />
            ) : (
                <EmptyVideo />
            )}
            <NextButton
                disabled={currentFrameIndex == numberOfFrames - 1}
                onClick={onClickNext}
                icon='keyboard_arrow_right'
            />
        </VideoContainer>
        {onRecord && (
            <BigButton
                style={{
                    maxWidth: '480px',
                    width: '100%',
                    display: 'block',
                    margin: '16px auto 24px auto'
                }}
                onClick={onRecord}
                label='Record video'
                raised
                danger
            />
        )}
        <PaginationIndicator
            currentIndex={currentFrameIndex}
            numberOfItems={numberOfFrames}
            style={{
                marginBottom: '24px',
                marginTop: '24px'
            }}
        />
    </VideoPlayerContainer>
)

VideoPlayer.propTypes = {
    currentFrame: PropTypes.shape({
        cloudinaryPublicId: PropTypes.string
    }),
    currentFrameIndex: PropTypes.number,
    numberOfFrames: PropTypes.number,
    onClickNext: PropTypes.func,
    onClickPrevious: PropTypes.func,
    onPlaying: PropTypes.func,
    onStopped: PropTypes.func,
    onRecord: PropTypes.func
}
