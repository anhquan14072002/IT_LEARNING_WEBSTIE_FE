import React, { useContext, useEffect, useState } from "react";
import image from "../../assets/img/image.png";
import message from "../../assets/Icons/message2.png";
import { Button } from "primereact/button";
import { useSelector } from "react-redux";
import PostContext from "../../store/PostContext";
import { isLoggedIn } from "../../utils";
import { BASE_URL_FE } from "../../services/restClient";
function PostQuestion({ post, isFavoritePost }) {
  const user = useSelector((state) => state.user.value);
  const {
    deletePost,
    checkUser,
    setItemSidebar,
    createFavoritePost,
    createPostNotification,
    fetchPostById,
    setCompose,
  } = useContext(PostContext);
  const {
    content,
    userName,
    avatar,
    createdDate,
    gradeTitle,
    gradeId,
    userId,
    id,
    numberOfComment,
    roles,
    fullName
  } = post;
  const [isFavorite, setIsFavorite] = useState(isFavoritePost);
  const isCheckUser =
    (userId === user?.sub && isLoggedIn()) ||
    (user?.role == "Admin" && isLoggedIn());
  let contentJsx = <div dangerouslySetInnerHTML={{ __html: content }} />;
  function responseAnswer() {
    if (checkUser()) {
      deletePost(id);
      notifyPersonalResponse();
    }
  }
  function notifyPersonalResponse() {
    /* solution: Where is the origin of action from ? 
          - pass body in request :  */
    const body = {
      notificationType: 1,
      userSendId: user?.sub,
      userSendName: `${user?.family_name} ${user?.given_name}`,
      userReceiveId: user?.sub,
      userReceiveName: `${user?.family_name} ${user?.given_name}`,
      description: `Bạn đã thu hồi bài bài viết thành công`,
      notificationTime: new Date(),
      isRead: false,
      link: `${BASE_URL_FE}/post/${-1}`,
    };
    createPostNotification(body);
  }
  const formattedDate = new Date(createdDate).toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  function handleChooseGrade() {
    setItemSidebar((preValue) => {
      return { ...preValue, gradeIdSelected: gradeId };
    });
  }
  function createFavoritePostEvent() {
    setIsFavorite((preValue) => !preValue);
    createFavoritePost(id);
  }
  function editPost() {
    /* solution: Where is the origin of action from ? 
        -  take id post and call api open 
        - isCompose
        - send data for isCompose  */

    scrollToTop();
    fetchPostById(id);
  }
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <div className="border-stone-200 border-b-2 ">
      <div className="rounded p-5 flex flex-col gap-3">
        <p className="flex justify-between items-center">
          <span className="flex gap-3">
            <span className="flex items-center">
              <img
                src={avatar || image}
                alt="Ảnh người dùng"
                style={{
                  borderRadius: "25px",
                  height: "35px",
                  maxWidth: "35px",
                }}
                className="rounded-full"
                onError={(e) => (e.target.src = image)}
              />
            </span>
            <span className="flex flex-col gap-2">
              <strong className="text-xl font-medium">{fullName}</strong>
              {roles.map(
                (role) =>
                  role != "User" && (
                    <Button
                      label={role}
                      severity="warning"
                      style={{ backgroundColor: "#f58220" }}
                      className="text-white rounded-3xl text-sm w-fit px-2 font-bold"
                    />
                  )
              )}
              <span className="text-sm text-stone-400">
                {/* 12 giờ trước (20:28) - SIT18 */}
                {formattedDate}
              </span>
            </span>
          </span>

          {/* <i
            className="pi pi-search"
            style={{ fontSize: "0.9 rem", color: "#708090" }}
          ></i> */}
        </p>
        <p className="text-xl">{contentJsx}</p>
        <p>
          <Button
            label={` #Tin học ${gradeTitle}`}
            severity="warning"
            style={{ backgroundColor: "#bc594a" }}
            onClick={handleChooseGrade}
            className="text-white px-2 py-1 rounded-3xl text-sm"
          />
        </p>
        <p className="flex gap-4 mt-1 items-center">
          {isLoggedIn() && (
            <i
              onClick={createFavoritePostEvent}
              className="pi pi-bookmark"
              style={{
                fontSize: "1.2rem",
                color: !isFavorite ? "#708090" : "rgb(250, 165, 0)",
              }}
            ></i>
          )}
          {/* <i
            className="pi  pi-exclamation-triangle"
            style={{ fontSize: "1.4rem", color: "#708090" }}
          ></i> */}
          <span class="relative inline-flex items-center">
            <span class="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
              {numberOfComment}
            </span>
            <img src={message} alt="Ảnh tin nhắn" class="w-6 h-6 text-black" />
          </span>

          {isCheckUser && (
            <span>
              <a className="cursor-pointer" onClick={responseAnswer}>
                Thu hồi
              </a>
            </span>
          )}
          {userId === user?.sub && isLoggedIn() && (
            <span>
              <a className="cursor-pointer" onClick={editPost}>
                Chỉnh sửa bài bài viết
              </a>
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

export default PostQuestion;
