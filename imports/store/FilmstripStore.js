import { Meteor } from 'meteor/meteor'
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

  setFrameValue(frame, attribute, value) {
    this.isDirty = true
    this.getFrame(frame._id)[attribute] = value
  }

  createFrame(filmstripId) {
    const no = this.getMaxFrameNo() + 1
    Meteor.call(
      'filmstrip.frame.create',
      { filmstripId, no },
      (error, frame) => {
        if (error)
          return Notifications.error('Frame could not be created', error) // TODO i18n
        this.frames.push(frame)
        this.frameId = frame._id
      }
    )
  }

  removeFrame(frame) {
    Meteor.call('filmstrip.frame.remove', frame._id, error => {
      if (error) return Notifications.error('Frame could not be deleted', error) // TODO i18n
      this.frames = this.frames.filter(f => f._id !== frame._id)
      this.frameId = this.frames[0]._id
    })
  }

  persist() {
    Meteor.call('filmstrip.saveWithFrames', this.filmstrip, this.frames)
  }
}
