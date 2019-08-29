import { Invites } from '/imports/db/invites.js'
import { Meteor } from 'meteor/meteor'
import { Notifications } from '/imports/ui/UIHelpers.js'
import { observable } from 'mobx'

export const invitesStore = observable({
  isDirty: false,
  filmstripId: undefined,
  invites: [],
  isInvitesLoading: true,
  selectedInviteIDs: [],

  filmstripsResponded: [],
  isFilmstripsRespondedLoading: true,
  filmstripsRespondedIDs: [],

  selectInvite(invite) {
    if (this.selectedInviteIDs.includes(invite._id)) {
      return (this.selectedInviteIDs = this.selectedInviteIDs.filter(
        id => id !== invite._id
      ))
    }
    this.selectedInviteIDs.push(invite._id)
  },

  selectAllInvites() {
    if (this.selectedInviteIDs.length) {
      return (this.selectedInviteIDs = [])
    }
    this.selectedInviteIDs = this.invites.map(invite => invite._id)
  },

  get hasSelectedInvites() {
    return this.selectedInviteIDs.length > 0
  },

  selectInviteResponded(invite) {
    if (this.filmstripsRespondedIDs.includes(invite._id)) {
      return (this.filmstripsRespondedIDs = this.filmstripsRespondedIDs.filter(
        id => id !== invite._id
      ))
    }
    this.filmstripsRespondedIDs.push(invite._id)
  },

  selectAllInvitesResponded() {
    if (this.filmstripsRespondedIDs.length) {
      return (this.filmstripsRespondedIDs = [])
    }
    this.filmstripsRespondedIDs = this.filmstripsResponded.map(invite => invite._id)
  },

  get hasSelectedInvitesResponded() {
    return this.filmstripsRespondedIDs.length > 0
  },

  invitesCount: 0,
  respondedCount: 0,

  createInvite({ name, email }) {
    Meteor.call(
      'filmstrip.invite.create',
      { filmstripId: this.filmstripId, name, email },
      (error, _id) => {
        if (error)
          return Notifications.error('Invite could not be created', error) // TODO i18n
        const invite = Invites.findOne(_id)
        this.invites.push(invite)
        this.invitesCount = this.invites.length
      }
    )
  },

  removeSelectedInvites() {
    Meteor.call('filmstrip.invite.remove', this.selectedInviteIDs)
    this.invites = this.invites.filter(
      invite => !this.selectedInviteIDs.includes(invite._id)
    )
    this.invitesCount = this.invites.length
    this.selectedInviteIDs = []
  }
})
