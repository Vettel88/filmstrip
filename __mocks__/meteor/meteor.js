const Meteor = {
    publish: jest.fn(),
    subscribe: jest.fn(),
    startup: jest.fn(),
    isServer: false,
    settings: {
        public: {
            cloudinary: {
                cloudName: null
            },
        }
    }
}

module.exports = { Meteor }
