import React, { useRef, useState } from "react";
import { Button } from "primereact/button";
import { useForm, Controller } from "react-hook-form";
import LoginComponent from "../../components/LoginComponent";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import { sendVerifyEmail, verifyEmail } from "../../services/authenService";
import { ACCEPT, CHECKMAIL, REJECT } from "../../utils";
import { Toast } from "primereact/toast";
import Menu from "../../components/Menu";
import { InputText } from "primereact/inputtext";
import { assets } from "../../assets/assets";
import NotifyProvider from "../../store/NotificationContext";
import { InputOtp } from "primereact/inputotp";
import "./index.css";
const Index = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const toast = useRef(null);
  const [currState, setCurrState] = useState("CheckMail");
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data.email, data.token);

    if (currState === "CheckMail") {
      try {
        await sendVerifyEmail(data.email);
        setCurrState("Confirm");
        ACCEPT(toast, "Vui lòng kiểm tra mail để lấy mã OTP");
      } catch (error) {
        REJECT(toast, "Tài khoản đã tồn tại");
      }
    } else {
      try {
        await verifyEmail(data.email, data.token);
        navigate(`/register?email=${data.email}`);
      } catch (error) {
        REJECT(toast, "Mã OTP không tồn tại");
      }
    }
  };

  return (
    <NotifyProvider>
      <div className="min-h-screen overflow-hidden">
        <Header />
        <Menu />
        <div className="flex h-screen">
          <div className="w-1/2">
            <div className="w-auto h-full">
              <img src={assets.image} alt="" className="w-full h-full" />
            </div>
          </div>

          <div className="w-1/2 h-full flex items-center justify-center">
            <div className="w-1/2 h-min">
              <h1 className="text-left mb-4 font-bold text-black text-3xl">
                Đăng kí
              </h1>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                  <label htmlFor="email" className="cursor-pointer">
                    <h4 className="text-xl text-black font-medium">
                      Email <span className="text-red-500">*</span>
                    </h4>
                  </label>
                  <Controller
                    name="email"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Email không được để trống",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Email không hợp lệ",
                      },
                    }}
                    render={({ field }) => (
                      <InputText
                        id="email"
                        type="text"
                        className="w-full h-10 text-black-800 border border-solid border-gray-600 pb-2 pl-1 rounded-md shadow-none"
                        placeholder="Nhập email"
                        disabled={currState === "Confirm"}
                        {...field}
                      />
                    )}
                  />
                  {errors.email && (
                    <span className="text-red-500 text-sm">
                      {errors.email.message}
                    </span>
                  )}
                </div>
                {currState === "Confirm" && (
                  <>
                    <div className="mb-4">
                      <label htmlFor="token" className="cursor-pointer">
                        <h4 className="text-xl  text-black font-medium">
                          Mã Xác Thực <span className="text-red-500">*</span>
                        </h4>
                      </label>
                      <Controller
                        name="token"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: "Mã xác thực không được để trống",
                        }}
                        render={({ field }) => (
                          <InputOtp
                            value={token}
                            onChange={(e) => {
                              setToken(e.value);
                              field.onChange(e.value);
                            }}
                            length={6}
                            className="border border-black shadow-none"
                          />
                        )}
                      />
                      {errors.token && (
                        <span className="text-red-500 text-sm">
                          {errors.token.message}
                        </span>
                      )}
                    </div>
                  </>
                )}

                <div className="mb-4">
                  <Button
                    label={currState === "Confirm" ? "Xác Nhận" : "Gửi Mail"}
                    type="submit"
                    severity="info"
                    className="w-full px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                  />
                </div>
              </form>

              <div className="w-full flex">
                <span
                  onClick={() => navigate("/login")}
                  className="text-blue-600 cursor-pointer"
                >
                  Đăng nhập
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
