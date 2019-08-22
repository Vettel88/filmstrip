
import { createSnackbarQueue } from '@rmwc/snackbar'

// export const Notifications = createSnackbarQueue()
const Notifications = createSnackbarQueue()
Notifications.error = (title) => Notifications.notify({ title, icon: 'error' })
Notifications.success = (title) => Notifications.notify({ title, icon: 'done' })


export { Notifications }