import React from 'react'
import { shallow } from 'enzyme'
import { FilmstripsList } from '../FilmstripsList'

let props = { }
describe('<FilmstripsList />', () => {
  const filmstripsList = shallow(<FilmstripsList {...props} />)

  it('<FilmstripsList /> should render', () => {
    expect(filmstripsList.exists()).toBe(true)
  })
})
