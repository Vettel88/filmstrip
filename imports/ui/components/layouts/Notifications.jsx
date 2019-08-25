
import { createSnackbarQueue } from '@rmwc/snackbar'

const Notifications = createSnackbarQueue()

Notifications.error = (title, error) => {
    Notifications.notify({ title, icon: 'error' })
    console.error(title, error)
}
Notifications.success = (title) => Notifications.notify({ title, icon: 'done' })


export { Notifications }