import { computed, observable } from 'mobx'
import { Meteor } from 'meteor/meteor'
import { Notifications } from '/imports/ui/UIHelpers.js'

export default class FilmstripStore {
    @observable isDirty = false

    @observable filmstripId
    @observable frameId

    @observable filmstrip
    @observable frames = []

    // Subscription Handles
    @observable filmstripHandle
    @observable framesHandle

    @computed get isLoading() {
        return typeof this.filmstrip === 'undefined' || !this.frames.length
    }

    @computed get currentFrame() {
        return this.frames.find(frame => frame._id === this.frameId)
    }

    getFrame(frameId) {
        return this.frames.find(frame => frame._id === frameId)
    }

    getMaxFrameNo() {
        return Math.max(...this.frames.map(f => f.no), 0)
    }

    setFilmstripValue(attribute, value) {
        this.isDirty = true
        this.filmstrip[attribute] = value
    }

    setFrameValue(frameOrFrameId, attribute, value) {
        const frameId =
            typeof frameOrFrameId === 'object'
                ? frameOrFrameId._id
                : frameOrFrameId
        this.isDirty = true
        this.getFrame(frameId)[attribute] = value
    }

    createFrame = filmstripId =>
        new Promise((resolve, reject) => {
            const no = this.getMaxFrameNo() + 1
            Meteor.call(
                'filmstrip.frame.create',
                { filmstripId, no },
                (error, frame) => {
                    if (error) {
                        reject(error)
                        return Notifications.error(
                            'Frame could not be created',
                            error
                        ) // TODO i18n
                    }
                    this.frames.push(frame)
                    this.frameId = frame._id
                    resolve(frame)
                }
            )
        })

    removeFrame = frameId =>
        new Promise((resolve, reject) => {
            Meteor.call('filmstrip.frame.remove', frameId, (error) => {
                if (error) {
                    reject(error)
                    return Notifications.error(
                        'Frame could not be deleted',
                        error
                    ) // TODO i18n
                }
                this.frames = this.frames.filter(f => f._id !== frameId)
                const lastFrame = this.frames[this.frames.length - 1]
                this.frameId = lastFrame._id
                resolve(lastFrame)
            })
        })

    persist() {
        Meteor.call('filmstrip.saveWithFrames', this.filmstrip, this.frames)
    }
}
