const Mongo = jest.mock('meteor/mongo')

Mongo.Collection = class Collection {
    _name = ''
    deny(){}
}

module.exports = { Mongo }