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

/**
 * Simple list of files uploaded through Filestack.
 * @param {Array} files         Files to be displayed (in Filestack object format)
 * @param {Function} onClick    Click handler. If left empty, clicking will open the file in a new window.
 * @param {Function} onRemove   Remove handler. If left empty, no remove icon will be displayed.
 */

export const FileList = ({ files, onClick, onRemove, ...rest }) => (
    <List twoLine {...rest}>
        {files &&
            files.map((file, index) => (
                <ListItem key={file.handle}>
                    <ListItemText onClick={onClick}>
                        <ListItemPrimaryText>
                            {file.filename}
                        </ListItemPrimaryText>
                        <ListItemSecondaryText>
                            {Math.round(file.size / 10000) / 100} MB
                        </ListItemSecondaryText>
                    </ListItemText>
                    {onRemove && (
                        <ListItemMeta
                            onClick={e => onRemove(e, file, index)}
                            icon='clear'
                        />
                    )}
                </ListItem>
            ))}
    </List>
)

FileList.propTypes = {
    files: PropTypes.array,
    onClick: PropTypes.func,
    onRemove: PropTypes.func
}
