import React from 'react'
import { shallow } from 'enzyme'
import { ResponseQuestionnaire } from '../ResponseQuestionnaire'

let props = { }
describe('<ResponseQuestionnaire />', () => {
  const responseQuestionnaire = shallow(<ResponseQuestionnaire {...props} />)

  it('<ResponseQuestionnaire /> should render', () => {
    expect(responseQuestionnaire.exists()).toBe(true)
  })
})
