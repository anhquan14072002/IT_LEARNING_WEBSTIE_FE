import React, { useRef, useState, useEffect } from "react";
import { Button } from "primereact/button";
import { useForm, Controller } from "react-hook-form";
import LoginComponent from "../../components/LoginComponent";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import { forgotPassword, login } from "../../services/authenService";
import { CHECKMAIL, decodeToken, REJECT } from "../../utils";
import { Toast } from "primereact/toast";
import Menu from "../../components/Menu";
import { InputText } from "primereact/inputtext";
import { assets } from "../../assets/assets";
import { useDispatch } from "react-redux";
import { addUser } from "../../redux/userr/userSlice";
import NotifyProvider from "../../store/NotificationContext";

const Index = () => {
  const toast = useRef(null);
  const [checked, setChecked] = useState(false);
  const [currState, setCurrState] = useState("Login");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    // Retrieve saved email and password from localStorage
    const savedEmail = localStorage.getItem("email") || "";
    const savedPassword = localStorage.getItem("password") || "";
    setChecked(!!savedEmail); // Update checked state based on savedEmail
    reset({ email: savedEmail, password: savedPassword }); // Set initial form values
  }, [reset]);

  const saveLoginInfo = (data) => {
    if (checked) {
      localStorage.setItem("email", data.email);
      localStorage.setItem("password", data.password);
    } else {
      localStorage.removeItem("email");
      localStorage.removeItem("password");
    }
  };

  const onSubmit = async (data, e) => {
    e.preventDefault();
    saveLoginInfo(data);
    const { email, password } = data;
    console.log(data); // Handle form submission
    if (currState === "Login") {
      try {
        const response = await login({ email, password });

        localStorage.setItem("accessToken", response.data.data.accessToken);
        localStorage.setItem("refreshToken", response.data.data.refreshToken);
        localStorage.setItem("userId", response.data.data.userDto.id);
        localStorage.setItem("userEmail", response.data.data.userDto.email);
        const decodedToken = decodeToken(response?.data?.data?.accessToken);
        dispatch(addUser(decodedToken));
        navigate("/");
      } catch (error) {
        REJECT(toast, "Tài khoản hoặc mật khẩu sai");
      }
    }
    if (currState === "ForgotPassword") {
      console.log(email);
      try {
        await forgotPassword(email);
        CHECKMAIL(toast, "Vui lòng kiểm tra mail để xác thực");
      } catch (error) {
        REJECT(toast, "Mail này chưa được đăng kí tài khoản");
      }
    }
  };

  return (
    <NotifyProvider>
      <div className="min-h-screen">
        <Header />
        <Menu />
        <div className="flex h-screen">
          <div className="w-1/2 hidden md:block">
            <div className="w-auto h-full  ">
              <img src={assets.image} alt="" className="w-full h-full" />
            </div>
          </div>

          <div className="w-full md:w-1/2 h-full flex items-center justify-center p-4 md:p-8">
            <div
              className="w-full max-w-md p-6 
        sm:border sm:border-gray-300 sm:rounded-lg sm:shadow-md sm:bg-white 
        lg:border-0 lg:rounded-none lg:shadow-none lg:bg-transparent"
            >
              {currState === "Login" && (
                <h1 className="text-left mb-4 font-bold text-black text-3xl">
                  Đăng Nhập
                </h1>
              )}
              {currState === "ForgotPassword" && (
                <h1 className="text-left mb-4 font-bold text-black text-3xl">
                  Quên mật khẩu
                </h1>
              )}

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                  <label htmlFor="email" className="cursor-pointer">
                    <h4 className="text-xl text-black font-medium">
                      {currState === "ForgotPassword" ? "Email" : "Tài khoản"}{" "}
                      <span className="text-red-500">*</span>
                    </h4>
                  </label>
                  <Controller
                    name="email"
                    control={control}
                    defaultValue=""
                    rules={{
                      required:
                        currState === "ForgotPassword"
                          ? "Email không được để trống"
                          : "Tài khoản không được để trống",
                      pattern:
                        currState === "ForgotPassword"
                          ? {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Email không hợp lệ",
                            }
                          : undefined,
                    }}
                    render={({ field }) => (
                      <InputText
                        id="email"
                        type="text"
                        className="w-full h-10 text-black-800 border border-solid border-gray-600 pb-2 pl-1 rounded-md shadow-none"
                        placeholder={
                          currState === "ForgotPassword"
                            ? "Nhập email"
                            : "Nhập tài khoản hoặc email"
                        }
                        {...field}
                      />
                    )}
                  />

                  <br />
                  {errors.email && (
                    <span className="text-red-500 text-sm">
                      {errors.email.message}
                    </span>
                  )}
                </div>
                {currState === "Login" && (
                  <div className="mb-4">
                    <label htmlFor="password" className="cursor-pointer">
                      <h4 className="text-xl text-black font-medium">
                        Mật Khẩu <span className="text-red-500">*</span>
                      </h4>
                    </label>
                    <Controller
                      name="password"
                      control={control}
                      defaultValue=""
                      rules={{
                        required: "Mật khẩu không được để trống",
                        pattern: {
                          value:
                            /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/,
                          message:
                            "Mật khẩu cần ít nhất 6 ký tự, bao gồm chữ cái đầu viết hoa, số và ký tự đặc biệt",
                        },
                      }}
                      render={({ field }) => (
                        <InputText
                          id="password"
                          type="password"
                          className="w-full h-10 text-black-800 border border-solid border-gray-600 pb-2 pl-1 rounded-md shadow-none"
                          placeholder="Nhập mật khẩu"
                          {...field}
                        />
                      )}
                    />
                    <br />
                    {errors.password && (
                      <span className="text-red-500 text-sm">
                        {errors.password.message}
                      </span>
                    )}
                  </div>
                )}
                {currState === "Login" && (
                  <div className="mb-4 flex items-center">
                    <input
                      type="checkbox"
                      onChange={(e) => setChecked(e.target.checked)}
                      checked={checked}
                      className="mr-2"
                    />
                    <span>Ghi nhớ mật khẩu</span>
                  </div>
                )}

                {currState === "Login" ? (
                  <div className="mb-4">
                    <Button
                      label="Đăng Nhập"
                      type="submit"
                      severity="info"
                      className="w-full px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                    />
                  </div>
                ) : (
                  <div className="mb-4">
                    <Button
                      label="Gửi Mail"
                      type="submit"
                      severity="info"
                      className="w-full px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                    />
                  </div>
                )}
              </form>
              <div className="w-full flex justify-between">
                {currState === "Login" ? (
                  <span
                    onClick={() => setCurrState("ForgotPassword")}
                    className="text-blue-600 cursor-pointer"
                  >
                    Quên mật khẩu
                  </span>
                ) : (
                  <span
                    onClick={() => setCurrState("Login")}
                    className="text-blue-600 cursor-pointer"
                  >
                    Đăng nhập
                  </span>
                )}

                <span
                  onClick={() => navigate("/checkmail")}
                  className="text-blue-600 cursor-pointer"
                >
                  Tạo tài khoản
                </span>
              </div>
              <div className="flex items-center my-4">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="mx-4 text-gray-500">Hoặc đăng nhập với</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>
              <LoginComponent />
            </div>
          </div>
        </div>
        <Toast ref={toast} />
      </div>
    </NotifyProvider>
  );
};

export default Index;
