import React from 'react'
import { Dialog, DialogContent } from 'rmwc'
import { withRouter } from 'react-router'

const ModalLayout = withRouter((props) => {
    const [open, setOpen] = React.useState(true);
    return (
        <Dialog
            open={open}
            onClose={_ => {
                props.history.goBack()
                setOpen(false)}
            }
        >
            <DialogContent>
                { props.responsive ?
                    <div className="setModalWidth">{props.children}</div> :
                    props.children
                }
            </DialogContent>
        </Dialog>
    );
})

export default ModalLayout
