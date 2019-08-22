const Accounts = jest.genMockFromModule('meteor/accounts-base')

Accounts.createUser = function () { return jest.fn() }

module.exports = { Accounts }
