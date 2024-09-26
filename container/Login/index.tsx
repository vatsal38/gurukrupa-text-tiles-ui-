import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import axiosInstance from "@/services/axiosConfig";
import AuthServices from "@/services/AuthServices";
import toast from "react-hot-toast";
import {
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import SendIcon from "@mui/icons-material/Send";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: any) => {
    event.preventDefault();
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();

  const login = async (data: any) => {
    setIsLoading(true);
    const response: any = await axiosInstance.post(`/auth/login`, data);
    if (response && response?.data?.access_token) {
      AuthServices.setToken(response?.data?.access_token);
      router.push("/dashboard");
      toast.success(response?.message);
    }
    setIsLoading(false);
  };

  return (
    <div>
      <div className="flex flex-wrap min-h-screen w-full content-center justify-center bg-gray-200 py-10">
        <div className="flex shadow-md">
          <div className="flex flex-wrap content-center justify-center rounded-l-md bg-white w-[24rem] h-[32rem]">
            <div className="w-72">
              <h1 className="text-xl font-semibold">GURUKRUPA TEXT TILES</h1>
              <small className="text-gray-400">
                Welcome back! Please enter your details
              </small>

              <div className="mt-5">
                <form onSubmit={handleSubmit(login)}>
                  <div className="mb-4">
                    <TextField
                      error={errors.username ? true : false}
                      {...register("username", {
                        required: "Username is required",
                      })}
                      id="username"
                      label="Username"
                      helperText={
                        errors.username && (errors.username.message as any)
                      }
                      sx={{ width: "100%" }}
                    />
                  </div>

                  <div className="mb-4">
                    <FormControl
                      sx={{ width: "100%" }}
                      variant="outlined"
                      error={errors.password ? true : false}
                    >
                      <InputLabel htmlFor="outlined-adornment-password">
                        Password
                      </InputLabel>
                      <OutlinedInput
                        id="password"
                        type={showPassword ? "text" : "password"}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              onMouseUp={handleMouseUpPassword}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                        label="Password"
                        {...register("password", {
                          required: "Password is required",
                        })}
                      />
                      {errors.password && (
                        <FormHelperText>
                          {errors.password.message as any}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </div>

                  <div className="mb-3 flex flex-wrap content-center">
                    <a href="#" className="text-xs font-semibold text-blue-700">
                      Forgot password?
                    </a>
                  </div>

                  <LoadingButton
                    endIcon={<SendIcon />}
                    loading={isLoading}
                    loadingPosition="end"
                    variant="contained"
                    className="w-full"
                    type="submit"
                  >
                    Submit
                  </LoadingButton>
                </form>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap content-center justify-center rounded-r-md w-[24rem] h-[32rem]">
            <img
              className="w-full h-full bg-center bg-no-repeat bg-cover rounded-r-md"
              src="/images/guru.jpg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
