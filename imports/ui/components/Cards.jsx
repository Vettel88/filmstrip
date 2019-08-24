import { Meteor } from 'meteor/meteor'
import { Card, Elevation, Typography } from 'rmwc'
import React from 'react'
import styled, { css } from 'styled-components'

const StyledCard = styled(Card)`
  
  padding: 64px;
  margin-bottom: 1rem;

  @media (max-width: 839px) {
    padding: 32px;
  }

  @media (max-width: 479px) {
    padding: 24px;
  }

  text-align: ${props => props.align ? props.align : 'inherit'};
`

export const PaddedCard = ({ children, ...props }) => {
  return (
    <Elevation z={4} wrap>
      <StyledCard {...props}>
        {children}
      </StyledCard>
    </Elevation>
  )
}

/**
 * Card with:
 * - An image (optional)
 * - Headline (optional)
 * - Caption (optional)
 * - Copy (optional)
 */
export const IconCard = styled(({
  headline,
  caption,
  copy,
  image,
  children,
  ...rest
}) =>
  <PaddedCard align='center' {...rest}>
    <img src={image} style={{  }} />
    { headline ? <Typography tag='h4' use='headline4'>{headline}</Typography> : '' }
    { caption  ? <Typography tag='p' use='body1' style={!copy ? { marginBottom: '24px' } : {}}>{caption}</Typography> : '' }
    { copy     ? <Typography tag='h6' use='body2' style={{ marginBottom: '24px' }}>{copy}</Typography> : '' }
    {children}
  </PaddedCard>)`
  > img {

    width: 240px;
    margin: 0 auto 24px auto;

    @media (max-width: 839px) {
      width: 200px;
    }

    @media (max-width: 479px) {
      width: 160px;
    }

  }
`
