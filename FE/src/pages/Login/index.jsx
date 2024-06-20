import React, { useState } from "react";
import { Button } from "primereact/button";
import { useForm, Controller } from "react-hook-form";
import LoginComponent from "../../components/LoginComponent";

const Index = () => {
  const [checked, setChecked] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm(); // Initialize useForm hook

  const onSubmit = (data) => {
    console.log(data.email); // Handle form submission
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2">
        <div className="w-auto h-full">
          <img
            src="https://primefaces.org/cdn/primereact/images/galleria/galleria7.jpg"
            alt=""
            className="w-full h-full"
          />
        </div>
      </div>

      <div className="w-1/2 flex items-center justify-center">
        <div className="w-1/2 h-min">
          <h1 className="text-left mb-4 font-bold text-black text-3xl">
            Đăng Nhập
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
                  <input
                    type="text"
                    className="w-full h-10 text-black-800 border border-solid border-gray-600 pb-2 pl-1 rounded-md"
                    placeholder="Nhập email"
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
                      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/,
                    message:
                      "Mật khẩu cần ít nhất 8 ký tự, bao gồm chữ cái đầu viết hoa, số và ký tự đặc biệt",
                  },
                }}
                render={({ field }) => (
                  <input
                    type="password"
                    className="w-full h-10 text-black-800 border border-solid border-gray-600 pb-2 pl-1 rounded-md"
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
            <div className="mb-4">
              <input
                type="checkbox"
                onChange={(e) => setChecked(e.target.checked)}
                checked={checked}
              />
              <span className="ml-2">Ghi nhớ mật khẩu</span>
            </div>
            <div className="mb-4">
              <Button
                label="Đăng Nhập"
                type="submit"
                severity="info"
                className="w-full px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
              />
            </div>
          </form>
          <div className="w-full flex justify-between">
            <a className="text-blue-600" href="#">
              Quên mật khẩu
            </a>
            <a className="text-blue-600" href="#">
              Tạo tài khoản
            </a>
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
  );
};

export default Index;