import React from 'react'
import { shallow } from 'enzyme'
import FilmstripsItem from '../FilmstripsItem'

describe('<FilmstripsItem />', () => {
  const filmstripsItem = shallow(<FilmstripsItem />)

  it('<FilmstripsItem /> should render', () => {
    expect(filmstripsItem.exists()).toBe(true)
  })
})
