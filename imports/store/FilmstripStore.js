import { observable, computed } from 'mobx'

export default class FilmstripStore {
    @observable isLive = false
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
        console.log("Persisting Filmstrip #", this.filmstrip._id)
    }
}
