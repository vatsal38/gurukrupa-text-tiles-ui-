import React, { useEffect, useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import { Box, Fade, Modal, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import SendIcon from "@mui/icons-material/Send";
import machineServices from "@/services/Apis/machine";
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

function AddMachineModal({ open, handleClose, refetchMachine, item }: any) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm();

  const isEdit = Object.keys(item).length !== 0 ? true : false;

  const [isLoading, setIsLoading] = useState(false);

  const addMachine = async (data: any) => {
    console.log("data::: ", data);
    setIsLoading(true);
    if (isEdit) {
      const response: any = await machineServices.updateMachine(
        item?._id,
        data
      );
      if (response) {
        toast.success(response?.message);
        handleClose();
        refetchMachine();
        reset();
      }
    } else {
      const response: any = await machineServices.createMachine(data);
      if (response) {
        toast.success(response?.message);
        handleClose();
        refetchMachine();
        reset();
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (Object.keys(item).length !== 0) {
      setValue("machineNumber", item.machineNumber);
      setValue("floor", item.floor);
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
            Add Machine
          </Typography>
          <form
            className="grid grid-cols-2 mt-6 gap-4"
            onSubmit={handleSubmit(addMachine)}
          >
            <TextField
              type="text"
              error={errors.machineNumber ? true : false}
              {...register("machineNumber", {
                required: "machineNumber is required",
              })}
              id="machineNumber"
              label="Machine Number"
              helperText={
                errors.machineNumber && (errors.machineNumber.message as any)
              }
              className="w-full"
            />
            <TextField
              type="text"
              error={errors.floor ? true : false}
              {...register("floor", {
                required: "floor is required",
              })}
              id="floor"
              label="Floor"
              helperText={errors.floor && (errors.floor.message as any)}
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

export default AddMachineModal;
