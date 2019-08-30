import { Meteor } from 'meteor/meteor'
import { ListItemGraphic } from 'rmwc'
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
