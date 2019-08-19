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

    @computed get isLoading(){
        return (typeof this.filmstrip === 'undefined' || !this.frames.length)
    }

    @computed get currentFrame() {
        return this.frames.find(frame => frame._id === this.frameId)
    }

    toggleLive(){
        this.filmstrip.live = !this.filmstrip.live
        Meteor.call('filmstrip.toggleLive', { filmstrip: this.filmstrip })
    }

    getFrame(frameId){
        return this.frames.find(frame => frame._id === frameId)
    }

    setFilmstripValue(attribute, value){
        this.isDirty = true
        this.filmstrip[attribute] = value
    }

    setFrameValue(frame, attribute, value){
        this.isDirty = true
        this.getFrame(frame._id)[attribute] = value
    }

    persist(){
        Meteor.call('filmstrip.update', this.filmstrip)
        this.frames.forEach(frame => {
            Meteor.call('filmstrip.frame.save', {
                filmstripId: this.filmstrip._id,
                no: frame.no,
                frame
            })
        })
    }
}
