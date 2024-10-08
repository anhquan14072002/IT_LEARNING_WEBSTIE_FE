import React, { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Formik, Form, ErrorMessage, Field } from "formik";
import * as Yup from "yup";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import PostContentItem from "./PostContentItem";
import CustomDropdownInSearch from "../../shared/CustomDropdownInSearch";
import LoadingScreen from "../LoadingScreen";
import UncontrolledEditor from "../../shared/CustomEditorSecond";
import PostContext from "../../store/PostContext";
import { ACCEPT, containsRudeWords, isLoggedIn } from "../../utils";
import "../../shared/CustomDropdown/index.css";
import { getAllGrade } from "../../services/grade.api";
import image from "../../assets/img/image.png";
import restClient, { BASE_URL, BASE_URL_FE } from "../../services/restClient";
const validationSchema = Yup.object({
  grade: Yup.object()
    .test("is-not-empty", "Không được để trống trường này", (value) => {
      return Object.keys(value).length !== 0;
    })
    .required("Không bỏ trống trường này"),
});

function PostContent({ ...props }) {
  const { compose, setCompose } = useContext(PostContext);

  return (
    <div
      className="w-full md:w-[80%] mt-4  flex flex-col gap-5 grow "
      // className="w-[80%] mt-4 h-screen flex flex-col gap-5 flex-grow ml-[18%]"
    >
      {!compose?.isCompose ? (
        <ComposeComment
          onClick={() =>
            setCompose((preValue) => ({ isCompose: true, data: null }))
          }
        />
      ) : (
        <PostWrite
          setCompose={setCompose}
          key={compose?.data?.data}
          compose={compose}
        />
      )}
      <main>
        <PostContentItem />
      </main>
    </div>
  );
}

function PostWrite({ setCompose, compose }) {
  const {
    createPost,
    loading,
    setLoading,
    createPostNotification,
    updatePost,
  } = useContext(PostContext);

  const user = useSelector((state) => state.user.value);
  const toast = useRef(null);
  const [initialValues, setInitialValues] = useState({ grade: {} });
  const [description, setDescription] = useState("");
  const [gradeList, setListGrade] = useState([]);
  useEffect(() => {
    if (compose?.data != null) {
      async function getGradeById() {
        const gradeById = await restClient({
          url: `api/grade/getgradebyid/${compose?.data?.gradeId}?include=false`,
          method: "GET",
        });
        const gradeByIdData = gradeById.data?.data || {};
        console.log(gradeByIdData);

        setDescription(compose?.data?.content);
        setInitialValues((preValue) => ({ grade: gradeByIdData }));
      }
      getGradeById();
    }
  }, [compose?.data]);

  useEffect(() => {
    getAllGrade(setLoading, setListGrade);
  }, []);
  const handleEditorChange = (htmlContent) => {
    setDescription(htmlContent);
  };

  const onSubmit = async (values) => {
    if (description.trim() === "") {
      ACCEPT(toast, "Bạn cần nhập thêm nội dung bài bài viết ? ");
      return;
    }
    if (containsRudeWords(description)) {
      ACCEPT(toast, "Câu hỏi của bạn chứa những từ không hợp lệ");
      return;
    }
    if (!isLoggedIn()) {
      ACCEPT(toast, "Bạn chưa đăng nhập?");
      return;
    }

    const descriptionPost = {
      content: description,
      userId: user?.sub,
      gradeId: values.grade?.id,
    };

    let postId = compose?.data?.idPost;
    let postIdResponse;
    if (postId) {
      postIdResponse = postId;
      updatePost({ ...descriptionPost, id: postId });
    } else {
      const postIdResponse2 = await createPost(descriptionPost);
      postIdResponse = postIdResponse2?.id;
    }
    notifyPersonalResponse(postId, postIdResponse);
    setCompose((preValue) => ({
      data: null,
      isCompose: false,
    }));
  };
  function notifyPersonalResponse(postId, id = 0) {
    /* solution: Where is the origin of action from ? 
          - pass body in request :  */
    console.log(id);

    const body = {
      notificationType: 1,
      userSendId: user?.sub,
      userSendName: `${user?.family_name} ${user?.given_name}`,
      userReceiveId: user?.sub,
      userReceiveName: `${user?.family_name} ${user?.given_name}`,
      description: `Bạn vừa ${postId ? "sửa" : "tạo"} bài viết thành công`,
      notificationTime: new Date(),
      isRead: false,
      link: `${BASE_URL_FE}/post/${id}`,
    };
    createPostNotification(body);
  }

  const handleOnChangeGrade = (e, helpers, setTouchedState, props) => {
    helpers.setValue(e.value);
    setTouchedState(true);
    if (props.onChange) {
      props.onChange(e);
    }
  };

  return (
    <>
      <Toast ref={toast} />
      {loading ? (
        <LoadingScreen setLoading={setLoading} />
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {(formik) => (
            <Form className="flex flex-col">
              <div className="w-80 ">
                <CustomDropdownInSearch
                  isNotRequired
                  title="Chọn Lớp"
                  name="grade"
                  id="grade"
                  isClear={true}
                  handleOnChange={(e, helpers, setTouchedState, props) =>
                    handleOnChangeGrade(e, helpers, setTouchedState, props)
                  }
                  options={gradeList}
                />
              </div>
              <div>
                <UncontrolledEditor
                  onChange={handleEditorChange}
                  value={compose?.data?.content || ""}
                />
                <ErrorMessage name="description" component="div" />
              </div>
              <div className="flex justify-end gap-2 mt-[6rem] sm:mt-[3rem]">
                <Button
                  className="px-3 border-2 hover:bg-gray-100 "
                  type="button"
                  severity="danger"
                  onClick={() =>
                    setCompose((preValue) => ({
                      data: null,
                      isCompose: false,
                    }))
                  }
                >
                  Hủy
                </Button>
                <Button
                  className="p-2 bg-blue-600 hover:bg-blue-500 text-white font-bold"
                  type="submit"
                >
                  {compose?.data ? "Sửa" : "Tạo"} bài đăng
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </>
  );
}

function ComposeComment({ ...props }) {
  const user = useSelector((state) => state.user.value);
  return (
    <header
      className="border-stone-200 border-2 p-3 rounded cursor-pointer"
      {...props}
    >
      <p className="flex gap-3 items-center">
        {isLoggedIn() ? (
          <span className="flex items-center">
            <img
              src={user?.picture || image}
              alt="Ảnh người dùng"
              className="rounded-full"
              style={{ borderRadius: "25px", height: "30px", maxWidth: "30px" }}
              onError={(e) => (e.target.src = image)}
            />
          </span>
        ) : (
          // <i className="pi pi-user" style={{ color: "slateblue" }}></i>
          <span className="flex items-center">
            <img
              src={image}
              alt="Ảnh người dùng"
              style={{ borderRadius: "25px", height: "30px", maxWidth: "30px" }}
            />
          </span>
        )}
        {console.log(user)}
        <span className="font-bold">
          {isLoggedIn() ? `${user?.family_name} ${user?.given_name}` : "Khách"}
        </span>
      </p>
      <p className="text-stone-500">Hãy nhập câu hỏi của bạn vào đây</p>
    </header>
  );
}

export default PostContent;
