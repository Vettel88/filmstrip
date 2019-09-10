import { Meteor } from 'meteor/meteor'
import { ListItemGraphic } from 'rmwc'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

export const ListItemAvatar = styled(ListItemGraphic)`
    margin-left: 0;
    margin-right: 16px;
    width: 40px;
    height: 40px;
    display: block;
    position: relative;
    .rmwc-avatar__icon,
    .rmwc-avatar__text {
        position: absolute;
        top: 0;
        left: 0;
        border-radius: 50%;
        display: block;
        width: 40px;
        height: 40px;
        z-index: 2;
    }
    .rmwc-avatar__text {
        z-index: 1;
        border: 1px solid rgba(0, 0, 0, 0.24);
        color: rgba(0, 0, 0, 0.24);
        text-align: center;
        font-family: Roboto;
        font-size: 16px;
        padding-top: 12px;
    }
`

const Dot = styled('a')`
    background-color: ${props =>
        props.selected ? 'var(--mdc-theme-primary)' : '#ddd'};
    width: 16px;
    height: 16px;
    margin: 0 4px;
    border-radius: 50%;
`

const DotContainer = styled('div')`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
`

/**
 * Pagination indicator; list of dots, optionally clickable
 * @param {Number}      currentIndex    Index of current dot
 * @param {Number}      numberOfItems   Total number of dots
 * @param {Function}    onClick         Index of current dot
 */
export const PaginationIndicator = ({
    currentIndex,
    numberOfItems,
    onClick,
    ...rest
}) => {
    return (
        <DotContainer {...rest}>
            {Array.from({ length: numberOfItems }).map((item, index) => (
                <Dot
                    key={`Dot-${index}`}
                    onClick={onClick ? onClick : undefined}
                    selected={currentIndex === index}
                />
            ))}
        </DotContainer>
    )
}

PaginationIndicator.propTypes = {
    currentIndex: PropTypes.number,
    numberOfItems: PropTypes.number,
    onClick: PropTypes.func
}
