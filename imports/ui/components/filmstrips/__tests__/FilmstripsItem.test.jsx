import React from 'react'
import { shallow } from 'enzyme'
import FilmstripsItem from '../FilmstripsItem'

let props = { }
describe('<FilmstripsItem />', () => {
  const filmstripsItem = shallow(<FilmstripsItem {...props} />)

  it('<FilmstripsItem /> should render', () => {
    expect(filmstripsItem.exists()).toBe(true)
  })
})
