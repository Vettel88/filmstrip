import { observable, computed } from 'mobx'

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

    setFilmstripValue(attribute, value) {
        this.isDirty = true
        this.filmstrip[attribute] = value
    }

    setFrameValue(frame, attribute, value) {
        this.isDirty = true
        this.getFrame(frame._id)[attribute] = value
    }

    persist() {
        Meteor.call('filmstrip.saveWithFrames', this.filmstrip, this.frames)
    }
}
