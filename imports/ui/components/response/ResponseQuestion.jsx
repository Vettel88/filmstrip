import { Meteor } from 'meteor/meteor'
import React from 'react'
import { Typography } from 'rmwc'
import { PaddedCard as Card } from '/imports/ui/components/Cards.jsx'
import { Link } from 'react-router-dom'
import Video from '/imports/ui/components/Video.js'

export const ResponseQuestion = ({
    t,
    currentFrame,
    filmstrip,
    currentFrameIndex
}) => {
    let files, link

    if (currentFrame.files && currentFrame.files.length) {
        files = (
            <>
                <Typography tag='h6' use='headline6'>
                    {t('Files')}
                </Typography>
                <ul>
                    {currentFrame.files.map(file => (
                        <li key={file.handle}>
                            <a
                                href={file.url}
                                target='_blank'
                                rel='noopener noreferrer'>
                                {file.filename}
                            </a>
                        </li>
                    ))}
                </ul>
            </>
        )
    }

    if (currentFrame.link) {
        link = (
            <>
                <Typography tag='h6' use='headline6'>
                    {t('Link')}
                </Typography>
                <a
                    href={currentFrame.link}
                    target='_blank'
                    rel='noopener noreferrer'>
                    {currentFrame.link}
                </a>
            </>
        )
    }

    return (
        <Card>
            <Typography use='headline6' tag='h6'>
                {currentFrameIndex + 1}/{filmstrip.frames.length}:{' '}
                {currentFrame.title}
            </Typography>
            {currentFrame.cloudinaryPublicId && (
                <div style={{ marginBottom: '24px' }}>
                    <Video
                        publicId={currentFrame.cloudinaryPublicId}
                        width='100%'
                    />
                </div>
            )}
            <Typography use='body1' tag='p'>
                {currentFrame.description}
            </Typography>
            {files}
            {link}
        </Card>
    )
}
