import React, { useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { useForm, Controller } from "react-hook-form";
import LoginComponent from "../../components/LoginComponent";
import Header from "../../components/Header";
import { useLocation, useNavigate } from "react-router-dom";
import { registerUser, verifyEmail } from "../../services/authenService";
import { REJECT, SUCCESS } from "../../utils";
import { Toast } from "primereact/toast";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}
const index = () => {
  const toast = useRef(null);
  const query = useQuery();
  const token = query.get("token");
  const email = query.get("email");
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await verifyEmail(token);
  //       console.log(response.data.isSucceeded);
  //       // if (!response.data.isSucceeded) {
  //       //   navigate("/checkmail");
  //       // }
  //     } catch (error) {
  //       console.error("Error verifying email:", error);
  //     }
  //   };
  //   fetchData();
  // }, [token, navigate]);

  const onSubmit = async (data) => {
    const { firstname, lastname, username, password } = data;
    console.log(firstname, lastname, username, password);
    try {
      await registerUser({ email, username, firstname, lastname, password });
      SUCCESS(toast, "Đăng kí thành công");
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {}
    REJECT(toast,"Không đăng kí được")
  };

  return (
    <div>
      <Header />
      <div className="flex h-screen ">
        <div className="w-1/2">
          <div className="w-auto h-full">
            <img
              src="https://primefaces.org/cdn/primereact/images/galleria/galleria7.jpg"
              alt=""
              className="w-full h-full"
            />
          </div>
        </div>

        <div className="w-1/2  flex items-center justify-center ">
          <div className="w-8/12   ">
            <h1 className="text-left mb-4 font-bold text-black text-3xl">
              Tạo tài khoản
            </h1>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex">
                <div className="mb-4 mr-8">
                  <label htmlFor="firstname" className="cursor-pointer">
                    <h4 className=" text-xl text-black font-medium">
                      Họ <span className="text-red-500">*</span>
                    </h4>
                  </label>
                  <Controller
                    name="firstname"
                    defaultValue=""
                    control={control}
                    rules={{
                      required: "Họ không được để trống",
                    }}
                    render={({ field }) => (
                      <input
                        id="firstname"
                        type="text"
                        className="w-full h- text-black-800 border border-solid border-gray-600  pb-2 pl-1 rounded-md"
                        placeholder="Nhập họ"
                        {...field}
                      />
                    )}
                  />
                  <br />
                  {errors.firstname && (
                    <span className="text-red-500 text-sm">
                      {errors.firstname.message}
                    </span>
                  )}
                </div>
                <div className="mb-4">
                  <label htmlFor="lastname" className="cursor-pointer">
                    <h4 className=" text-xl text-black font-medium">
                      Tên <span className="text-red-500">*</span>
                    </h4>
                  </label>
                  <Controller
                    name="lastname"
                    defaultValue=""
                    control={control}
                    rules={{
                      required: "Tên không được để trống",
                    }}
                    render={({ field }) => (
                      <input
                        id="lastname"
                        type="text"
                        className="w-full h-10 text-black-800 border border-solid border-gray-600  pb-2 pl-1 rounded-md"
                        placeholder="Nhập Tên"
                        {...field}
                      />
                    )}
                  />
                  <br />
                  {errors.lastname && (
                    <span className="text-red-500 text-sm">
                      {errors.lastname.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="username" className="cursor-pointer">
                  <h4 className=" text-xl text-black font-medium">
                    Tên tài khoản <span className="text-red-500">*</span>
                  </h4>
                </label>
                <Controller
                  name="username"
                  defaultValue=""
                  control={control}
                  rules={{
                    required: "Tên tài khoản không được để trống",
                  }}
                  render={({ field }) => (
                    <input
                      id="username"
                      type="text"
                      className="w-full h-10 text-black-800 border border-solid border-gray-600  pb-2 pl-1 rounded-md"
                      placeholder="Nhập Tên"
                      {...field}
                    />
                  )}
                />
                <br />
                {errors.username && (
                  <span className="text-red-500 text-sm">
                    {errors.username.message}
                  </span>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="cursor-pointer">
                  <h4 className=" text-xl text-black font-medium">
                    Mật Khẩu <span className="text-red-500">*</span>
                  </h4>
                </label>
                <Controller
                  name="password"
                  defaultValue=""
                  control={control}
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
                      id="password"
                      type="password"
                      className=" w-full h-10 text-black-800 border border-solid border-gray-600  pb-1 pl-1 rounded-md"
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
                <label htmlFor="passwordAgain" className="cursor-pointer">
                  <h4 className=" text-xl text-black font-medium">
                    Nhập lại mật khẩu <span className="text-red-500">*</span>
                  </h4>
                </label>
                <Controller
                  name="passwordAgain"
                  defaultValue=""
                  control={control}
                  rules={{
                    required: "Mật khẩu không được để trống",
                    validate: (value) =>
                      value === getValues("password") ||
                      "Mật khẩu nhập lại không khớp",
                  }}
                  render={({ field }) => (
                    <input
                      id="passwordAgain"
                      type="password"
                      className=" w-full h-10 text-black-800 border border-solid border-gray-600  pb-2 pl-1 rounded-md"
                      placeholder="Nhập mật khẩu"
                      {...field}
                    />
                  )}
                />
                <br />
                {errors.passwordAgain && (
                  <span className="text-red-500 text-sm">
                    {errors.passwordAgain.message}
                  </span>
                )}
              </div>
              <div className="mb-4">
                <Button
                  label="Đăng Ký"
                  type="submit"
                  severity="info"
                  className=" w-full px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                />
              </div>
            </form>

            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-gray-500">Hoặc đăng ký với</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            <LoginComponent />
          </div>
        </div>
      </div>
      <Toast ref={toast} />
    </div>
  );
};

export default index;
