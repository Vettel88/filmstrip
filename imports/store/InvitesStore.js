import { observable, computed } from 'mobx'
import { Invites } from '/imports/db/invites.js'

class InvitesStoreClass {
    @observable isDirty = false
    @observable invites = []
    @observable isInvitesLoading = true
    @observable selectedInviteIDs = []

    selectInvite(invite) {
        if (this.selectedInviteIDs.includes(invite._id)) {
            return this.selectedInviteIDs = this.selectedInviteIDs.filter(id => id !== invite._id)
        }
        this.selectedInviteIDs.push(invite._id)
    }

    selectAllInvites() {
        if (this.selectedInviteIDs.length) {
            return this.selectedInviteIDs = []
        }
        this.selectedInviteIDs = this.invites.map(invite => invite._id)
    }

    @computed get hasSelectedInvites() {
        return this.selectedInviteIDs.length > 0
    }

    addInvite({ name, email }) {
        Meteor.call('filmstrip.invite.create', {name, email}, (error, _id) => {
            if (error) return console.error(error)
            const invite = Invites.findOne(_id)
            this.invites.push(invite)
        })
    }

    removeSelectedInvites() {
        Meteor.call('filmstrip.invite.remove', this.selectedInviteIDs)
        this.invites = this.invites.filter(invite => !this.selectedInviteIDs.includes(invite._id))
        this.selectedInviteIDs = []
    }

    persist() {
        // Meteor.call('filmstrip.saveWithFrames', this.filmstrip, this.frames)
        this.isDirty = false
    }
}

export const InvitesStore = new InvitesStoreClass()