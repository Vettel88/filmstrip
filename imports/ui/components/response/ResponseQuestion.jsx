import { Meteor } from 'meteor/meteor'
import React from 'react'
import { Typography } from 'rmwc'
import { PaddedCard as Card } from '/imports/ui/components/Cards.jsx'
import Video from '/imports/ui/components/Video.js'
import { FileList } from '/imports/ui/components/FileList.jsx'

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
                <FileList showFilename={true} files={currentFrame.files} />
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
