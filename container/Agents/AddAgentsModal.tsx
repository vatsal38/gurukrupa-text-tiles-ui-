import React, { useEffect, useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import { Box, Fade, Modal, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import SendIcon from "@mui/icons-material/Send";
import agentServices from "@/services/Apis/agent";
import toast from "react-hot-toast";

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

function AddAgentModal({ open, handleClose, refetchAgent, item }: any) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm();

  const isEdit = Object.keys(item).length !== 0 ? true : false;

  const [isLoading, setIsLoading] = useState(false);
  const addAgent = async (data: any) => {
    setIsLoading(true);
    if (isEdit) {
      const response: any = await agentServices.updateAgent(item?._id, data);
      if (response) {
        toast.success(response?.message);
        handleClose();
        refetchAgent();
        reset();
      }
    } else {
      const response: any = await agentServices.createAgent(data);
      if (response) {
        toast.success(response?.message);
        handleClose();
        refetchAgent();
        reset();
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (Object.keys(item).length !== 0) {
      setValue("name", item.name);
      setValue("phone", item.phone);
      setValue("image", item.image);
    }
  }, [item]);

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={() => {
        handleClose();
        reset();
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
            Add Agent
          </Typography>
          <form
            className="grid grid-cols-2 mt-6 gap-4"
            onSubmit={handleSubmit(addAgent)}
          >
            <TextField
              error={errors.name ? true : false}
              {...register("name", {
                required: "Name is required",
              })}
              id="name"
              label="Name"
              helperText={errors.name && (errors.name.message as any)}
              className="w-full"
            />
            <TextField
              type="number"
              error={errors.phone ? true : false}
              {...register("phone", {
                required: "Phone is required",
              })}
              id="phone"
              label="Phone Number"
              helperText={errors.phone && (errors.phone.message as any)}
              className="w-full"
            />
            <LoadingButton
              endIcon={<SendIcon />}
              loading={isLoading}
              loadingPosition="end"
              variant="contained"
              className="w-full col-span-2"
              type="submit"
            >
              {isEdit ? "Update" : "Submit"}
            </LoadingButton>
          </form>
        </Box>
      </Fade>
    </Modal>
  );
}

export default AddAgentModal;
