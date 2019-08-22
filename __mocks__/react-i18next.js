import React from 'react'

const ReactI18Next = {
    withTranslation: () => (component) => {
        return (component || React.createElement('div'))
    }
}

module.exports = ReactI18Next
