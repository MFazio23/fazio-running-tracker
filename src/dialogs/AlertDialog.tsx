import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material';
import {AlertDialogType} from '../RunningScreen';

export interface AlertDialogProps {
    isOpen: boolean,
    dialogType: AlertDialogType,
    title: string,
    content: string,
    handleCloseDialog: (dialogType: AlertDialogType, isConfirmed: boolean) => void,
}

export const AlertDialog = (
    {
        isOpen,
        dialogType,
        title,
        content,
        handleCloseDialog
    }: AlertDialogProps
) => {
    return (
        <Dialog
            open={isOpen}
            onClose={(isConfirmed: boolean) => handleCloseDialog(dialogType, isConfirmed)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">{content}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleCloseDialog(dialogType, false)}>Cancel</Button>
                <Button onClick={() => handleCloseDialog(dialogType, true)} autoFocus>OK</Button>
            </DialogActions>
        </Dialog>
    )
}
