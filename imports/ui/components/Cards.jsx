import { Meteor } from 'meteor/meteor'
import { Card, Elevation } from 'rmwc'
import React from 'react'
import styled from 'styled-components'

const StyledCard = styled(Card)`
    
    padding: 64px;

    @media (max-width: 839px) {
      padding: 32px;
    }

    @media (max-width: 479px) {
      padding: 24px;
    }
`

export const PaddedCard = (props) => {
  return (
    <Elevation z={4} wrap>
      <StyledCard>
        {props.children}
      </StyledCard>
    </Elevation>
  )
}