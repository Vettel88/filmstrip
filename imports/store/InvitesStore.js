import { observable, computed, observe } from 'mobx'
import { Invites } from '/imports/db/invites.js'
import { Notifications } from '/imports/ui/UIHelpers.js'

export const InvitesStore = observable({
    isDirty: false,
    filmstripId: undefined,
    invites: [],
    isInvitesLoading: true,
    selectedInviteIDs: [],

    selectInvite(invite) {
        if (this.selectedInviteIDs.includes(invite._id)) {
            return this.selectedInviteIDs = this.selectedInviteIDs.filter(id => id !== invite._id)
        }
        this.selectedInviteIDs.push(invite._id)
    },

    selectAllInvites() {
        if (this.selectedInviteIDs.length) {
            return this.selectedInviteIDs = []
        }
        this.selectedInviteIDs = this.invites.map(invite => invite._id)
    },

    get hasSelectedInvites() {
        return this.selectedInviteIDs.length > 0
    },

    createInvite({ name, email }) {
        Meteor.call('filmstrip.invite.create', {filmstripId: this.filmstripId, name, email}, (error, _id) => {
            if (error) return Notifications.error('Invite could not be created', error) // TODO i18n
            const invite = Invites.findOne(_id)
            this.invites.push(invite)
            this.isDirty = false
        })
    },

    removeSelectedInvites() {
        Meteor.call('filmstrip.invite.remove', this.selectedInviteIDs)
        this.invites = this.invites.filter(invite => !this.selectedInviteIDs.includes(invite._id))
        this.selectedInviteIDs = []
    },
})
