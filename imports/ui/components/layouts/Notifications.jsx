
import { createSnackbarQueue } from '@rmwc/snackbar'

// export const Notifications = createSnackbarQueue()
const Notifications = createSnackbarQueue()
Notifications.error = (title) => {
    Notifications.notify({ title, icon: 'error' })
}

export { Notifications }