import { observable, computed } from 'mobx'
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
        return (typeof this.filmstrip === 'undefined' || !this.frames.length)
    }

    @computed get currentFrame() {
        return this.frames.find(frame => frame._id === this.frameId)
    }

    toggleLive() {
        this.filmstrip.live = !this.filmstrip.live
        Meteor.call('filmstrip.setLive', this.filmstrip, this.filmstrip.live)
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

    setFrameValue(frame, attribute, value) {
        this.isDirty = true
        this.getFrame(frame._id)[attribute] = value
    }

    createFrame(filmstripId) {
        const no = this.getMaxFrameNo() + 1
        Meteor.call('filmstrip.frame.create', { filmstripId, no }, (error, frame) => {
            if (error) return Notifications.error('Frame could not be created', error) // TODO i18n
            this.frames.push(frame)    
        })
    }

    persist() {
        Meteor.call('filmstrip.saveWithFrames', this.filmstrip, this.frames)
    }
}
