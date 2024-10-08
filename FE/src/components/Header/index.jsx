import React, { useContext, useEffect, useRef, useState } from "react";
import avatar from "../../assets/img/icons8-male-user-50.png";
import logo from "../../assets/THV22.svg";
import arrowDown from "../../assets/img/icons8-sort-down-50.png";
import "./index.css";
import { Tooltip } from "primereact/tooltip";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import { Button } from "primereact/button";
import { useDispatch, useSelector } from "react-redux";
import {
  decodeToken,
  getTokenFromLocalStorage,
  isLoggedIn,
  logout,
} from "../../utils";
import { addUser, retmoveUser } from "../../redux/userr/userSlice";
import { Menu } from "primereact/menu";
import { NotificationContext } from "../../store/NotificationContext";
import image from "../../assets/img/image.png";
import restClient from "../../services/restClient";

export default function Header({ params, setParams, textSearchProps }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [textSearch, setTextSearch] = useState(textSearchProps || "");
  const [menuOpen, setMenuOpen] = useState(false); // State to track menu open/close
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();
  const menuRight = useRef(null);
  const [profile, setProfile] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const {
    numberOfNotification = 0,
    notifications,
    fetchListNotificationByUserId,
    markallasreadasync,
    deleteallnotificationbyuser,
    setRows,
    setTabIndex,
    activeTabIndex,
  } = useContext(NotificationContext);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showOptionNotifications, setShowOptionNotifications] = useState(false);
  // const [activeTabIndex, setActiveTabIndex] = useState(0);
  const getNavigationPathLogout = () => {
    if (user.role === "Admin" || user.role === "ContentManager") {
      return "/loginAdmin";
    }
    if (user.role === "User") {
      return "/login";
    }
    return "";
  };
  const handleLogout = () => {
    dispatch(retmoveUser());
    logout();
    navigate(getNavigationPathLogout());
  };
  const getNavigationPath = () => {
    if (user.role === "Admin") {
      return "/dashboard/statistic";
    }
    if (user.role === "ContentManager") {
      return "/dashboard/lesson";
    }
    return ""; // Default or fallback route
  };
  const items = [
    {
      items: [
        {
          label: "Đổi mật khẩu",
          icon: "pi pi-key",
          command: (e) => navigate("/changepassword"),
        },
        {
          label: "Quản lí tài khoản cá nhân",
          icon: "pi pi-user-edit",
          command: (e) => navigate("/profile"),
        },
        ...(user.role === "Admin" || user.role === "ContentManager"
          ? [
              {
                label: "Quản lí",
                icon: "pi pi-chart-bar",
                command: (e) => navigate(getNavigationPath()),
              },
            ]
          : []),
        {
          label: "Học bạ",
          icon: "pi pi-address-book",
          command: () => navigate("/historyQuiz"),
        },

        {
          label: "Đăng xuất",
          icon: "pi pi-sign-out",
          command: handleLogout,
        },
      ],
    },
  ];
  const fakeNotifications = [
    { id: 1, message: "You have a new message from John Doe." },
    { id: 2, message: "Your order #1234 has been shipped." },
    { id: 3, message: "Reminder: Your subscription expires tomorrow." },
    { id: 4, message: "New comment on your post." },
  ];
  const options = [
    {
      id: 1,
      message: "Đánh dấu tất cả đã đọc",
      icon: "pi pi-check",
      action: handleOption1,
    },
    {
      id: 2,
      message: "Xóa tất cả thông báo",
      icon: "pi pi-delete-left",
      action: handleOption2,
    },
  ];
  useEffect(() => {
    let decodedToken;
    if (!user || Object.keys(user).length === 0) {
      console.log("User is empty or not initialized");

      try {
        const token = getTokenFromLocalStorage();
        decodedToken = decodeToken(token);

        dispatch(addUser(decodedToken));
      } catch (error) {
        console.error("Error decoding token:", error);
        dispatch(retmoveUser());
      }
    }
  }, []);

  useEffect(() => {
    restClient({ url: `api/user/getuser/${localStorage.getItem("userId")}` })
      .then((res) => {
        setProfile(res?.data?.data);
      })
      .catch((err) => {
        setProfile();
      });
  }, []);

  function handleOption1() {
    markallasreadasync();
  }
  function handleOption2() {
    deleteallnotificationbyuser();
  }
  // Add user to the dependency array to monitor changes
  const handleBellClick = () => {
    setShowNotifications(!showNotifications);
    fetchListNotificationByUserId();
  };

  const handleKeyDown = (e) => {
    const trimmedText = e.target.value.trim();
    const encodedText = encodeURIComponent(trimmedText);
    if (e.key === "Enter") {
      if (location.pathname === "/search") {
        setParams({
          ...Object.fromEntries(params.entries()),
          text: encodedText,
        });
      }
      if (location.pathname !== "/search") {
        navigate(`/search?text=${encodedText}`);
      }
    }
  };

  useEffect(() => {
    setTextSearch("");
  }, [textSearchProps]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const tabsData = [
    {
      label: " Tất cả",
      content: (
        <NotificationList notifications={notifications} setRows={setRows} />
      ),
    },
    {
      label: "Chưa đọc",
      content: (
        <NotificationList notifications={notifications} setRows={setRows} />
      ),
    },
  ];

  return (
    <>
      <div className="z-50">
        <div className="bg-[#1976D2]  justify-between  py-2 px-10 hidden md:flex">
          <div className="flex items-center">
            <img
              className="h-[70px] w-[150px] cursor-pointer"
              src={logo}
              onClick={() => navigate("/")}
            />
          </div>

          <div className="flex items-center">
            <div className="border max-h-[50px] border-white rounded-3xl flex items-center px-2.5 py-2 gap-2.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="22"
                height="22"
                viewBox="0,0,256,256"
                className="fill-white"
              >
                <g
                  fillRule="nonzero"
                  stroke="none"
                  strokeWidth="1"
                  strokeLinecap="butt"
                  strokeLinejoin="miter"
                  strokeMiterlimit="10"
                  strokeDasharray=""
                  strokeDashoffset="0"
                  fontFamily="none"
                  fontWeight="none"
                  fontSize="none"
                  textAnchor="none"
                  style={{ mixBlendMode: "normal" }}
                >
                  <g transform="scale(5.12,5.12)">
                    <path d="M21,3c-9.37891,0 -17,7.62109 -17,17c0,9.37891 7.62109,17 17,17c3.71094,0 7.14063,-1.19531 9.9375,-3.21875l13.15625,13.125l2.8125,-2.8125l-13,-13.03125c2.55469,-2.97656 4.09375,-6.83984 4.09375,-11.0625c0,-9.37891 -7.62109,-17 -17,-17zM21,5c8.29688,0 15,6.70313 15,15c0,8.29688 -6.70312,15 -15,15c-8.29687,0 -15,-6.70312 -15,-15c0,-8.29687 6.70313,-15 15,-15z"></path>
                  </g>
                </g>
              </svg>
              <input
                id="search"
                placeholder="Tìm kiếm"
                value={textSearch}
                className="bg-transparent border-none text-white focus:outline-none placeholder:text-white"
                onChange={(e) => setTextSearch(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e)}
              />
            </div>

            {/* login */}
            {isLoggedIn() && (
              <div className="ml-10 flex items-center gap-3 my-auto">
                <div class="relative inline-flex items-center ">
                  {numberOfNotification > 0 && (
                    <span class="absolute top-2 right-1 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
                      {numberOfNotification}
                    </span>
                  )}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="30"
                    height="30"
                    viewBox="0, 0, 300, 150"
                    className="fill-white"
                    onClick={handleBellClick}
                  >
                    <g
                      fillRule="nonzero"
                      stroke="none"
                      strokeWidth="1"
                      strokeLinecap="butt"
                      strokeLinejoin="miter"
                      strokeMiterlimit="10"
                      strokeDasharray=""
                      strokeDashoffset="0"
                      fontFamily="none"
                      fontWeight="none"
                      fontSize="none"
                      textAnchor="none"
                      style={{ mixBlendMode: "normal" }}
                    >
                      <g transform="scale(5.12, 5.12)">
                        <path d="M25,0c-2.20703,0 -4,1.79297 -4,4c0,2.20703 1.79297,4 4,4c2.20703,0 4,-1.79297 4,-4c0,-2.20703 -1.79297,-4 -4,-4zM19.375,6.09375c-4.57031,1.95703 -7.375,6.36328 -7.375,11.90625c0,11 -3.80078,13.76172 -6.0625,15.40625c-1.00391,0.72656 -1.9375,1.40234 -1.9375,2.59375c0,4.20703 6.28125,6 21,6c14.71875,0 21,-1.79297 21,-6c0,-1.19141 -0.93359,-1.86719 -1.9375,-2.59375c-2.26172,-1.64453 -6.0625,-4.40625 -6.0625,-15.40625c0,-5.55859 -2.80078,-9.95312 -7.375,-11.90625c-0.85547,2.27344 -3.05859,3.90625 -5.625,3.90625c-2.56641,0 -4.76953,-1.63672 -5.625,-3.90625zM19,43.875c0,0.03906 0,0.08594 0,0.125c0,3.30859 2.69141,6 6,6c3.30859,0 6,-2.69141 6,-6c0,-0.03906 0,-0.08594 0,-0.125c-1.88281,0.07813 -3.88281,0.125 -6,0.125c-2.11719,0 -4.11719,-0.04687 -6,-0.125z"></path>
                      </g>
                    </g>
                  </svg>
                  {showNotifications && (
                    <div className="absolute top-10 z-10 -right-16 min-w-72 pb-3 bg-white shadow-lg rounded-lg border border-gray-200 ">
                      <div className="p-4 font-bold text-xl flex justify-between items-center ">
                        <span>Thông báo</span>
                        <span
                          className="relative inline-flex items-center"
                          onClick={() =>
                            setShowOptionNotifications((preValue) => !preValue)
                          }
                        >
                          <i
                            className="pi pi-ellipsis-v hover:bg-stone-200 hover: p-1 rounded-3xl"
                            style={{ fontSize: "0.9 rem", color: "#708090" }}
                          ></i>
                          {showOptionNotifications && (
                            <div className="absolute top-10 -right-4 min-w-60  bg-white shadow-lg rounded-lg border border-gray-200">
                              <table className="w-full mt-1">
                                <tbody>
                                  {options.length > 0 ? (
                                    options.map((notification) => (
                                      <tr
                                        key={notification.id}
                                        className="hover:bg-stone-100 cursor-pointer "
                                        onClick={notification.action}
                                      >
                                        <td className="p-2 text-center hover:bg-stone-100 rounded-l-lg">
                                          <i
                                            className={notification.icon}
                                            style={{
                                              fontSize: "0.9 rem",
                                              color: "#708090",
                                            }}
                                          ></i>
                                        </td>
                                        <td className="p-2 hover:bg-stone-100 rounded-r-lg text-sm ">
                                          {notification.message}
                                        </td>
                                      </tr>
                                    ))
                                  ) : (
                                    <tr>
                                      <td
                                        colSpan="2"
                                        className="p-2 text-center text-gray-500"
                                      >
                                        No notifications
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </span>
                      </div>

                      <div className="px-3 overflow-auto max-h-[58vh] ">
                        <ul className="flex flex-wrap text-sm font-sm text-center text-gray-500  dark:border-gray-200 dark:text-gray-400">
                          {tabsData.map((tab, idx) => (
                            <li key={idx} className="me-2">
                              <a
                                href="#"
                                className={`inline-block p-4 rounded-t-lg ${
                                  idx === activeTabIndex
                                    ? "text-blue-500 font-bold bg-gray-100 active dark:bg-gray-100 dark:text-blue-500"
                                    : "hover:text-gray-600  hover:bg-gray-50 dark:hover:bg-gray-100 dark:hover:text-gray-500"
                                }`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  setTabIndex(idx);
                                }}
                                tabindex={idx === activeTabIndex ? "0" : "-1"}
                                aria-selected={idx === activeTabIndex}
                              >
                                {tab.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                        {tabsData[activeTabIndex].content}
                        <p className="pb-1">
                          {" "}
                          {notifications.length >= 6 &&
                            notifications.length < numberOfNotification && (
                              <Button
                                label="Xem thêm thông báo trước đó"
                                text
                                raised
                                onClick={() =>
                                  setRows((preValue) => preValue + 6)
                                }
                                className="w-full  bg-stone-100  hover:bg-stone-100 text-stone-600 p-2 text-sm font-normal"
                              />
                            )}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <div className="ml-2 flex items-center">
                    <img
                      className="h-[40px] w-[40px] rounded-full"
                      src={
                        profile && profile.image
                          ? profile.image
                          : user?.picture || image
                      }
                    />
                    <Menu
                      model={items}
                      popup
                      ref={menuRight}
                      id="popup_menu_right"
                      popupAlignment="right"
                    />
                    <Button
                      icon="pi pi-angle-down"
                      className="text-white shadow-none"
                      onClick={(event) => menuRight.current.toggle(event)}
                      aria-controls="popup_menu_right"
                      aria-haspopup
                    />
                  </div>
                </div>
              </div>
            )}

            {!isLoggedIn() && (
              <div className="ml-10 px-5 flex gap-5">
                <Button
                  label="Đăng nhập"
                  text
                  raised
                  className="text-white px-3 py-3"
                  onClick={() => navigate("/login")}
                />
                <Button
                  label="Đăng kí"
                  severity="warning"
                  style={{ backgroundColor: "#FAA500" }}
                  className="text-white px-5 py-3"
                  onClick={() => navigate("/checkmail")}
                />
              </div>
            )}
          </div>
        </div>

        <div className="block md:hidden">
          <div className="relative">
            <div className="bg-[#1976D2]  justify-between  py-2 px-10 flex ">
              <div className="flex items-center">
                <img
                  className="h-[70px] w-[150px] cursor-pointer"
                  src={logo}
                  onClick={() => navigate("/")}
                />
              </div>

              <div className="flex items-center">
                <span
                  className="pi pi-bars text-xl text-white font-bold cursor-pointer"
                  onClick={() => setIsOpen(!isOpen)}
                ></span>
              </div>
            </div>
            {isOpen && (
              <div className="bg-[#1976D2]  justify-between  py-2 px-10 absolute w-full">
                <div className="flex flex-col gap-2 items-center">
                  <div className="border max-h-[50px] border-white rounded-3xl flex items-center px-2.5 py-2 gap-2.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      x="0px"
                      y="0px"
                      width="22"
                      height="22"
                      viewBox="0,0,256,256"
                      className="fill-white"
                    >
                      <g
                        fillRule="nonzero"
                        stroke="none"
                        strokeWidth="1"
                        strokeLinecap="butt"
                        strokeLinejoin="miter"
                        strokeMiterlimit="10"
                        strokeDasharray=""
                        strokeDashoffset="0"
                        fontFamily="none"
                        fontWeight="none"
                        fontSize="none"
                        textAnchor="none"
                        style={{ mixBlendMode: "normal" }}
                      >
                        <g transform="scale(5.12,5.12)">
                          <path d="M21,3c-9.37891,0 -17,7.62109 -17,17c0,9.37891 7.62109,17 17,17c3.71094,0 7.14063,-1.19531 9.9375,-3.21875l13.15625,13.125l2.8125,-2.8125l-13,-13.03125c2.55469,-2.97656 4.09375,-6.83984 4.09375,-11.0625c0,-9.37891 -7.62109,-17 -17,-17zM21,5c8.29688,0 15,6.70313 15,15c0,8.29688 -6.70312,15 -15,15c-8.29687,0 -15,-6.70312 -15,-15c0,-8.29687 6.70313,-15 15,-15z"></path>
                        </g>
                      </g>
                    </svg>
                    <input
                      id="search"
                      placeholder="Tìm kiếm"
                      value={textSearch}
                      className="bg-transparent border-none text-white focus:outline-none placeholder:text-white"
                      onChange={(e) => setTextSearch(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e)}
                    />
                  </div>

                  {/* login */}
                  {isLoggedIn() && (
                    <div className="ml-10 flex flex-col items-center gap-3 my-auto">
                      <div class="relative inline-flex items-center">
                        {numberOfNotification > 0 && (
                          <span class="absolute top-2 right-1 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
                            {numberOfNotification}
                          </span>
                        )}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          x="0px"
                          y="0px"
                          width="30"
                          height="30"
                          viewBox="0, 0, 300, 150"
                          className="fill-white"
                          onClick={handleBellClick}
                        >
                          <g
                            fillRule="nonzero"
                            stroke="none"
                            strokeWidth="1"
                            strokeLinecap="butt"
                            strokeLinejoin="miter"
                            strokeMiterlimit="10"
                            strokeDasharray=""
                            strokeDashoffset="0"
                            fontFamily="none"
                            fontWeight="none"
                            fontSize="none"
                            textAnchor="none"
                            style={{ mixBlendMode: "normal" }}
                          >
                            <g transform="scale(5.12, 5.12)">
                              <path d="M25,0c-2.20703,0 -4,1.79297 -4,4c0,2.20703 1.79297,4 4,4c2.20703,0 4,-1.79297 4,-4c0,-2.20703 -1.79297,-4 -4,-4zM19.375,6.09375c-4.57031,1.95703 -7.375,6.36328 -7.375,11.90625c0,11 -3.80078,13.76172 -6.0625,15.40625c-1.00391,0.72656 -1.9375,1.40234 -1.9375,2.59375c0,4.20703 6.28125,6 21,6c14.71875,0 21,-1.79297 21,-6c0,-1.19141 -0.93359,-1.86719 -1.9375,-2.59375c-2.26172,-1.64453 -6.0625,-4.40625 -6.0625,-15.40625c0,-5.55859 -2.80078,-9.95312 -7.375,-11.90625c-0.85547,2.27344 -3.05859,3.90625 -5.625,3.90625c-2.56641,0 -4.76953,-1.63672 -5.625,-3.90625zM19,43.875c0,0.03906 0,0.08594 0,0.125c0,3.30859 2.69141,6 6,6c3.30859,0 6,-2.69141 6,-6c0,-0.03906 0,-0.08594 0,-0.125c-1.88281,0.07813 -3.88281,0.125 -6,0.125c-2.11719,0 -4.11719,-0.04687 -6,-0.125z"></path>
                            </g>
                          </g>
                        </svg>
                        {showNotifications && (
                          <div className="absolute top-10 z-10 -right-28 min-w-72 pb-3 bg-white shadow-lg rounded-lg border border-gray-200 ">
                            <div className="p-4 font-bold text-xl flex justify-between items-center ">
                              <span>Thông báo</span>
                              <span
                                className="relative inline-flex items-center"
                                onClick={() =>
                                  setShowOptionNotifications(
                                    (preValue) => !preValue
                                  )
                                }
                              >
                                <i
                                  className="pi pi-ellipsis-v hover:bg-stone-200 hover: p-1 rounded-3xl"
                                  style={{
                                    fontSize: "0.9 rem",
                                    color: "#708090",
                                  }}
                                ></i>
                                {showOptionNotifications && (
                                  <div className="absolute top-10 -right-4 min-w-60  bg-white shadow-lg rounded-lg border border-gray-200">
                                    <table className="w-full mt-1">
                                      <tbody>
                                        {options.length > 0 ? (
                                          options.map((notification) => (
                                            <tr
                                              key={notification.id}
                                              className="hover:bg-stone-100 cursor-pointer "
                                              onClick={notification.action}
                                            >
                                              <td className="p-2 text-center hover:bg-stone-100 rounded-l-lg">
                                                <i
                                                  className={notification.icon}
                                                  style={{
                                                    fontSize: "0.9 rem",
                                                    color: "#708090",
                                                  }}
                                                ></i>
                                              </td>
                                              <td className="p-2 hover:bg-stone-100 rounded-r-lg text-sm ">
                                                {notification.message}
                                              </td>
                                            </tr>
                                          ))
                                        ) : (
                                          <tr>
                                            <td
                                              colSpan="2"
                                              className="p-2 text-center text-gray-500"
                                            >
                                              No notifications
                                            </td>
                                          </tr>
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                              </span>
                            </div>

                            <div className="px-3 overflow-auto max-h-[58vh] ">
                              <ul className="flex flex-wrap text-sm font-sm text-center text-gray-500  dark:border-gray-200 dark:text-gray-400">
                                {tabsData.map((tab, idx) => (
                                  <li key={idx} className="me-2">
                                    <a
                                      href="#"
                                      className={`inline-block p-4 rounded-t-lg ${
                                        idx === activeTabIndex
                                          ? "text-blue-500 font-bold bg-gray-100 active dark:bg-gray-100 dark:text-blue-500"
                                          : "hover:text-gray-600  hover:bg-gray-50 dark:hover:bg-gray-100 dark:hover:text-gray-500"
                                      }`}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        setTabIndex(idx);
                                      }}
                                      tabindex={
                                        idx === activeTabIndex ? "0" : "-1"
                                      }
                                      aria-selected={idx === activeTabIndex}
                                    >
                                      {tab.label}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                              {tabsData[activeTabIndex].content}
                              <p className="pb-1">
                                {" "}
                                {notifications.length >= 6 &&
                                  notifications.length <
                                    numberOfNotification && (
                                    <Button
                                      label="Xem thêm thông báo trước đó"
                                      text
                                      raised
                                      onClick={() =>
                                        setRows((preValue) => preValue + 6)
                                      }
                                      className="w-full  bg-stone-100  hover:bg-stone-100 text-stone-600 p-2 text-sm font-normal"
                                    />
                                  )}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="ml-2 flex items-center">
                          <img
                            className="h-[40px] w-[40px] rounded-full"
                            src={
                              profile && profile.image
                                ? profile.image
                                : user?.picture || image
                            }
                          />
                          <Menu
                            model={items}
                            popup
                            ref={menuRight}
                            id="popup_menu_right"
                            popupAlignment="right"
                          />
                          <Button
                            icon="pi pi-angle-down"
                            className="text-white shadow-none"
                            onClick={(event) => menuRight.current.toggle(event)}
                            aria-controls="popup_menu_right"
                            aria-haspopup
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {!isLoggedIn() && (
                    <div className="ml-10 px-5 flex flex-col gap-5">
                      <Button
                        label="Đăng nhập"
                        text
                        raised
                        className="text-white px-3 py-3"
                        onClick={() => navigate("/login")}
                      />
                      <Button
                        label="Đăng kí"
                        severity="warning"
                        style={{ backgroundColor: "#FAA500" }}
                        className="text-white px-5 py-3"
                        onClick={() => navigate("/checkmail")}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function NotificationList({ notifications }) {
  const navigate = useNavigate();
  function detailNotification(notification) {
    const link = notification?.link;

    if (link) {
      if (link.startsWith("http://") || link.startsWith("https://")) {
        // Absolute URL: Use window.location.href for navigation
        window.location.href = link;
      } else {
        // Relative URL: Use navigate from React Router
        navigate(link, { replace: true });
      }
    }
  }
  return (
    <table className="w-full mt-1 ">
      <tbody>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <tr
              key={notification.id}
              className="hover:bg-stone-100 cursor-pointer  "
              onClick={() => detailNotification(notification)}
            >
              <td className="p-2 text-center hover:bg-stone-100 rounded-l-lg">
                <img
                  src={notification?.userSendImage || image}
                  alt="Ảnh người dùng"
                  style={{
                    borderRadius: "35px",
                    height: "35px",
                    maxWidth: "35px",
                  }}
                  className="rounded-full"
                  onError={(e) => (e.target.src = image)}
                />
                {console.log(notification?.userSendImage)}
                {/* <img
                className="h-[40px] w-[40px] rounded-full"
                src={notification.userSendImage || image}
              /> */}
              </td>
              <td
                className={`p-2 hover:bg-stone-100 rounded-r-lg ${
                  notification.isRead ? "text-gray-500" : ""
                }`}
              >
                {notification.description}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="2" className="p-2 text-center text-gray-500">
              Chưa có thông báo nào
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
