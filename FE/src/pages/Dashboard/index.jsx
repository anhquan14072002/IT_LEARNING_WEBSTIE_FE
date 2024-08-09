import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ManageDocument from "../../components/ManageDocument";
import { ProgressSpinner } from "primereact/progressspinner";
import LoadingScreen from "../../components/LoadingScreen";
import ContentLesson from "../../components/ContentLesson";
import QuizManagement from "../../components/QuizManagement";
import { Tooltip } from "primereact/tooltip";
import ManageExam from "../../components/ManageExam";
import ManageTag from "../../components/ManageTag";
import ManageAccount from "../../components/ManageAccount";
import { useNavigate, useParams } from "react-router-dom";

import ManageCodeOnline from "../../components/ManageCodeOnline";
import { assets } from "../../assets/assets";
import NotifyProvider from "../../store/NotificationContext";


const Dashboard = () => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { typeId } = useParams();

  const Menus = [
<<<<<<< HEAD
    { title: "Thống kê", src: assets.chart_fill, index: "statistic" },
    { title: "Quản lí tài khoản", src: assets.user, index: "user" },
=======

    { title: "Thống kê", src:assets.chart_fill, index: "statistic" },
    { title: "Quản lí tài khoản", src:assets.user, index: "user" },
>>>>>>> a7b5924b07d7455e4868268905c45b868b1c5b38
    {
      title: "Quản lí tài liệu/chủ đề/bài học ",
      src: assets.folder,
      index: "adminManageDocument",
    },
    { title: "Quản lí bài học ", src: assets.folder, index: "lesson" },
    { title: "Quản lí câu hỏi ôn tập ", src: assets.folder, index: "quiz" },
    { title: "Quản lí đề thi", src: assets.folder, index: "test" },
    { title: "Quản lí tag ", src: assets.folder, index: "tag" },
    { title: "Quản lí bài thực hành", src: assets.folder, index: "codeeditor" },
  ];

  useEffect(()=>{
     if(!Menus.some((item,index)=> item.index === typeId)){
      navigate("/notfound")
     }
  },[])

  return (
    <>
      {loading ? (
        <LoadingScreen setLoading={setLoading} />
      ) : (
        <>
          <div className="fixed top-0 w-full z-30">
            <Header />
          </div>
          <div className="fixed left-0 top-16 z-20">
            <div
              className={`${
                open ? "w-72" : "w-20"
              } bg-dark-purple h-screen p-5 pt-8 duration-300`}
            >
              <img
                src={assets.control}
                className={`absolute cursor-pointer -right-3 top-9 w-7 border-dark-purple
               border-2 rounded-full ${!open ? "rotate-180" : ""}`}
                onClick={() => setOpen(!open)}
              />
              {/* <div className="flex gap-x-4 items-center">
                <img
                  src="/src/assets/logo.png"
                  className={`cursor-pointer duration-500 ${
                    open ? "rotate-[360deg]" : ""
                  }`}
                />
              </div> */}
              <ul className="pt-6">
                {Menus.map((Menu, index) => (
                  <li
                    key={Menu.index}
                    className={`flex rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 mt-2 ${
                      Menu.index === Number(typeId) ? "bg-light-white" : ""
                    }`}
                    onClick={() => {
                      navigate(`/dashboard/${Menu.index}`);
                    }}
                  >
<<<<<<< HEAD
                    {console.log(index)}
=======

>>>>>>> a7b5924b07d7455e4868268905c45b868b1c5b38
                    <Tooltip
                      target={`menu-${Menu.index}`}
                      content={Menu.title}
                    />
                    <img src={Menu.src} alt={Menu.title} />

                    <span
                      className={`${
                        !open ? "hidden" : ""
                      } origin-left duration-200`}
                    >
                      {Menu.title}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="ml-20 mt-16 p-7">
<<<<<<< HEAD
            <div className="h-screen" onClick={(e) => setOpen(false)}>
=======


            <div className="h-screen" onClick={(e)=>setOpen(false)}>

>>>>>>> a7b5924b07d7455e4868268905c45b868b1c5b38
              {typeId === "user" && <ManageAccount />}
              {typeId === "adminManageDocument" && <ManageDocument />}
              {typeId === "lesson" && <ContentLesson />}
              {typeId === "quiz" && <QuizManagement />}
              {typeId === "test" && <ManageExam />}
              {typeId === "tag" && <ManageTag />}
              {typeId === "codeeditor" && <ManageCodeOnline />}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Dashboard;
