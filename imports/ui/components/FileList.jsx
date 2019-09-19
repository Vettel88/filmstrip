import {
    List,
    ListItem,
    ListItemMeta,
    ListItemPrimaryText,
    ListItemSecondaryText,
    ListItemText
} from 'rmwc'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

const NoHeightListItem = styled(ListItem)`
    max-height: 300px;
    height: unset !important;
`
const imageRegex = new RegExp(/image/)

/**
 * Simple list of files uploaded through Filestack.
 * @param {Array} files         Files to be displayed (in Filestack object format)
 * @param {Function} onClick    Click handler. If left empty, clicking will open the file in a new window.
 * @param {Function} onRemove   Remove handler. If left empty, no remove icon will be displayed.
 */

export const FileList = ({ files, onClick, onRemove, ...rest }) => (
    <List twoLine {...rest}>
        {files &&
            files.map((file, index) => {
                const isImage = imageRegex.test(file.mimetype)
                return (
                    <NoHeightListItem key={file.handle}>
                        {isImage ? (
                            <a
                                href={file.url}
                                target='_blank'
                                rel='noopener noreferrer'>
                                <img
                                    src={file.url}
                                    alt={file.filename}
                                    style={{
                                        height: 'auto !important',
                                        width: '200px',
                                        margin: '0.4rem auto'
                                    }}
                                />
                            </a>
                        ) : (
                            <ListItemText onClick={onClick}>
                                <ListItemPrimaryText>
                                    <div style={{ paddingBottom: '1rem' }}>
                                        <a
                                            href={file.url}
                                            target='_blank'
                                            rel='noopener noreferrer'>
                                            {file.filename}
                                        </a>
                                    </div>
                                </ListItemPrimaryText>
                            </ListItemText>
                        )}
                        {onRemove && (
                            <ListItemMeta
                                onClick={e => onRemove(e, file, index)}
                                icon='clear'
                                style={{
                                    marginLeft: isImage ? '1rem' : 'auto'
                                }}
                            />
                        )}
                    </NoHeightListItem>
                )
            })}
    </List>
)

FileList.propTypes = {
    files: PropTypes.array,
    onClick: PropTypes.func,
    onRemove: PropTypes.func
}
