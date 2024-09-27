import React from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import sellerServices from "@/services/Apis/seller";
import toast from "react-hot-toast";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function ConfirmSellerModal({
  openConfirmBox,
  handleCloseConfirmBox,
  refetchSeller,
}: any) {
  const [isDelete, setIsDelete] = React.useState(false);
  const deleteSeller = async () => {
    setIsDelete(true);
    const response: any = await sellerServices.deleteSeller(
      openConfirmBox?.item?._id
    );
    if (response) {
      toast.success(response?.message);
      handleCloseConfirmBox();
      refetchSeller();
    }
    setIsDelete(false);
  };

  return (
    <Dialog
      open={openConfirmBox?.isOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleCloseConfirmBox}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{openConfirmBox?.item?.name as any}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          Are you sure you want to delete this data ?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseConfirmBox} sx={{ fontWeight: 600 }}>
          Cancel
        </Button>
        <Button onClick={deleteSeller} sx={{ fontWeight: 600 }} color="error">
          {isDelete ? <CircularProgress size="18px" color="error" /> : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmSellerModal;
