import { Dialog, DialogContent } from 'rmwc'
import { isIOS } from 'react-device-detect'
import { withRouter } from 'react-router'
import React from 'react'

const ModalLayout = withRouter(props => {
    const [open, setOpen] = React.useState(true)
    return isIOS ? (
        <div className='hiddenModal'>{props.children}</div>
    ) : (
        <Dialog
            open={open}
            onClose={_ => {
                props.history.goBack()
                setOpen(false)
            }}>
            <DialogContent>
                {props.responsive ? (
                    <div className='setModalWidth'>{props.children}</div>
                ) : (
                    props.children
                )}
            </DialogContent>
        </Dialog>
    )
})

export default ModalLayout
