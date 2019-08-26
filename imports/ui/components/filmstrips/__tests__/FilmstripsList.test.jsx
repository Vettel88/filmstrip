import React from 'react'
import { shallow } from 'enzyme'
import { FilmstripsList } from '../FilmstripsList'

describe('<FilmstripsList />', () => {
  const filmstripsList = shallow(<FilmstripsList />)

  it('<FilmstripsList /> should render', () => {
    expect(filmstripsList.exists()).toBe(true)
  })
})
