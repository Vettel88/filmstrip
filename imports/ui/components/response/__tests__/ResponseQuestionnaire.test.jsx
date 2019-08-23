import React from 'react'
import { shallow } from 'enzyme'
import { ResponseQuestionnaire } from '../ResponseQuestionnaire'

describe('<ResponseQuestionnaire />', () => {
  const responseQuestionnaire = shallow(<ResponseQuestionnaire />)

  it('<ResponseQuestionnaire /> should render', () => {
    expect(responseQuestionnaire.exists()).toBe(true)
  })
})
