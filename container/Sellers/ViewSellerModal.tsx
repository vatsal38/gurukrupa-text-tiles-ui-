import { Box, Fade, Modal, Typography } from "@mui/material";
import React from "react";
import Backdrop from "@mui/material/Backdrop";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  // border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: "14px",
};
function ViewSellerModal({ open, handleCloseViewBox, item }: any) {
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={() => {
        handleCloseViewBox();
      }}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Box sx={style}>
          <Typography variant="h5" sx={{ fontWeight: 500 }}>
            View Seller
          </Typography>
          <div className="grid grid-cols-2 gap-2 mt-6">
            <Typography sx={{ fontWeight: 600 }}>Seller Name : </Typography>
            <Typography>{item?.name}</Typography>
            <Typography sx={{ fontWeight: 600 }}>Seller Code : </Typography>
            <Typography>{item?.code}</Typography>
            <Typography sx={{ fontWeight: 600 }}>Phone Number : </Typography>
            <Typography>{item?.phone}</Typography>
            <Typography sx={{ fontWeight: 600 }}>GST Number : </Typography>
            <Typography>{item?.gstNo}</Typography>
            <Typography sx={{ fontWeight: 600 }}>Shop Address : </Typography>
            <Typography>{item?.shopAddress}</Typography>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
}

export default ViewSellerModal;
