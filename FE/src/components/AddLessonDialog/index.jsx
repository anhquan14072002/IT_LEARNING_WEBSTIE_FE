import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import classNames from "classnames";
import CustomTextInput from "../../shared/CustomTextInput";
import CustomSelectInput from "../../shared/CustomSelectInput";
import CustomTextarea from "../../shared/CustomTextarea";
import Loading from "../Loading";
import "./index.css";
import { Button } from "primereact/button";
import CustomEditor from "../../shared/CustomEditor";
import { REJECT, SUCCESS } from "../../utils";
import { FileUpload } from "primereact/fileupload";
import restClient from "../../services/restClient";
import CustomDropdown from "../../shared/CustomDropdown";
import CustomDropdownInSearch from "../../shared/CustomDropdownInSearch";
import { MultiSelect } from "primereact/multiselect";

export default function AddLessonDialog({
  visible,
  setVisible,
  toast,
  getData,
}) {
  const [files, setFiles] = useState([]);
  const [topicList, setListTopic] = useState([]);
  const [gradeList, setListGrade] = useState([]);
  const [documentList, setListDocument] = useState([]);
  const [isLoadingAddLesson, setIsLoadingAddLesson] = useState(false);
  const [clearTopic, setClearTopic] = useState(false);
  const [clearGrade, setClearGrade] = useState(false);
  const [tagList, setTagList] = useState([]);
  const [tag, setTag] = useState(null);
  //select insert content
  const [inputContet, setInputContent] = useState(true);

  const validationSchema = Yup.object({
    title: Yup.string()
      .trim()
      .required("Tiêu đề không được bỏ trống")
      .min(5, "Tiêu đề phải có ít nhất 5 ký tự")
      .max(50, "Tiêu đề không được vượt quá 50 ký tự"),
    ...(inputContet && {
      content: Yup.string().required("Mô tả không được bỏ trống"),
    }),
    index: Yup.number()
      .required("Vui lòng nhập số thứ tự của bài học")
      .integer("Số thứ tự phải là số nguyên")
      .min(1, "Số thứ tự phải từ 1 trở lên")
      .max(100, "Số thứ tự không được vượt quá 100"),
    topic: Yup.object()
      .test("is-not-empty", "Không được để trống trường này", (value) => {
        return Object.keys(value).length !== 0; // Check if object is not empty
      })
      .required("Không bỏ trống trường này"),
    grade: Yup.object()
      .test("is-not-empty", "Không được để trống trường này", (value) => {
        return Object.keys(value).length !== 0; // Check if object is not empty
      })
      .required("Không bỏ trống trường này"),
    document: Yup.object()
      .test("is-not-empty", "Không được để trống trường này", (value) => {
        return Object.keys(value).length !== 0; // Check if object is not empty
      })
      .required("Không bỏ trống trường này"),
  });

  const initialValues = {
    title: "",
    topic: {},
    grade: {},
    document: {},
    content: "",
    index: null,
  };

  useEffect(() => {
    restClient({
      url: `api/grade/getallgrade?isInclude=false`,
      method: "GET",
    })
      .then((res) => {
        setListGrade(res.data.data || []);
      })
      .catch((err) => {
        setListGrade([]);
      });
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const tagResponse = await restClient({
          url: "api/tag/getalltag",
          method: "GET",
        });
        console.log(tagResponse?.data?.data);
        setTagList(
          Array.isArray(tagResponse?.data?.data) ? tagResponse?.data?.data : []
        );
      } catch (error) {
        console.error("Failed to fetch tags:", error);
      }
    };

    fetchData();
  }, []);
  const onSubmit = (values) => {
    const formData = new FormData();
    formData.append("Title", values.title);
    formData.append("Index", values.index);
    formData.append("TopicId", values.topic.id);
    if (inputContet) {
      formData.append("Content", values.content);
    }
    formData.append("IsActive", false);
    if (tag && tag.length > 0) {
      tag.forEach((item, index) => {
        formData.append(`tagValues[${index}]`, item.keyWord);
      });
    }
    if (!inputContet) {
      if (files.length === 0) {
        REJECT(toast, "Vui lòng chọn file để tải lên");
        return;
      }
      if (files.some((file) => file.size > 10485760)) {
        REJECT(toast, "Vui lòng chọn file nhỏ hơn hoặc bằng 10mb");
        return;
      }
      files.forEach((file) => {
        formData.append("FilePath", file);
      });
    }
    setIsLoadingAddLesson(true);
    restClient({
      url: "api/lesson/createlesson",
      method: "POST",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((res) => {
        SUCCESS(toast, "Thêm bài học thành công");
        getData();
        setIsLoadingAddLesson(false);
        setFiles([]);
        setTag([]);
      })
      .catch((err) => {
        if (err.response && err.response.data) {
          const { message } = err.response.data;
          if (message === "Lesson Index is Duplicate !!!") {
            REJECT(toast, "Số thứ tự của bài học đã tồn tại!");
          } else {
            REJECT(toast, "Xảy ra lỗi khi thêm bài học");
          }
        } else {
          REJECT(toast, "Xảy ra lỗi khi thêm bài học");
        }

        setIsLoadingAddLesson(false);
        setTag([]);
      })
      .finally(() => {
        setVisible(false);
      });
  };

  const onFileSelect = (e) => {
    setFiles(e.files);
  };
  const handleChangeInputType = (e) => {
    console.log("====================================");
    console.log(e.target.value); // This should log the selected option value ("true" or "false")
    console.log("====================================");
    setInputContent(e.target.value === "true"); // Convert the selected value to a boolean
  };

  const handleOnChangeGrade = (e, helpers, setTouchedState, props) => {
    setClearGrade(true);
    setClearTopic(true);
    helpers.setValue(e.value);
    setTouchedState(true); // Set touched state to true when onChange is triggered
    if (props.onChange) {
      props.onChange(e); // Propagate the onChange event if provided
    }
    restClient({
      url: `api/document/getalldocumentbygrade/` + e.target.value.id,
      method: "GET",
    })
      .then((res) => {
        setListDocument(res.data.data || []);
        setListTopic([]);
      })
      .catch((err) => {
        setListDocument([]);
        setListTopic([]);
      });
  };

  const handleOnChangeDocument = (e, helpers, setTouchedState, props) => {
    setClearTopic(true);
    if (!e.target.value || !e.target.value.id) {
      setListTopic([]);
      helpers.setValue({});
      setTouchedState(true); // Set touched state to true when onChange is triggered
      if (props.onChange) {
        props.onChange(e); // Propagate the onChange event if provided
      }
      return; // Exit early if e.target.value or e.target.value.id is undefined
    }

    helpers.setValue(e.value);
    setTouchedState(true); // Set touched state to true when onChange is triggered
    if (props.onChange) {
      props.onChange(e); // Propagate the onChange event if provided
    }

    restClient({
      url: `api/topic/getalltopicbydocument/` + e.target.value.id,
      method: "GET",
    })
      .then((res) => {
        setListTopic(res.data.data || []);
      })
      .catch((err) => {
        setListTopic([]);
      });
  };

  return (
    <Dialog
      header="Thêm bài học"
      visible={visible}
      style={{ width: "50vw" }}
      onHide={() => {
        setListDocument([]);
        setListTopic([]);
        setFiles([]);
        if (!visible) return;
        setVisible(false);
      }}
    >
      {isLoadingAddLesson ? (
        <Loading />
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {(formik) => (
            <Form>
              <CustomDropdownInSearch
                title="Chọn lớp"
                label="Lớp"
                name="grade"
                id="grade"
                isClear={false}
                handleOnChange={handleOnChangeGrade}
                options={gradeList}
              />

              <CustomDropdownInSearch
                title="Chọn tài liệu"
                label="Tài liệu"
                name="document"
                id="document"
                isClear={true}
                clearGrade={clearGrade}
                setClearGrade={setClearGrade}
                disabled={!documentList || documentList.length === 0} // Disable if documentList is empty or undefined
                handleOnChange={handleOnChangeDocument}
                options={documentList}
              />

              <CustomDropdown
                title="Chọn chủ đề"
                label="Chủ đề"
                name="topic"
                id="topic"
                touched={false}
                clearTopic={clearTopic}
                setClearTopic={setClearTopic}
                disabled={!topicList || topicList.length === 0}
                options={topicList}
              />

              <CustomTextInput
                label="Bài số"
                name="index"
                type="number"
                id="index"
              />

              <CustomTextInput
                label="Tiêu đề"
                name="title"
                type="text"
                id="title"
              />

              <div>
                <>
                  <span>Tag</span>
                </>
                <MultiSelect
                  value={tag}
                  options={tagList}
                  onChange={(e) => setTag(e.value)}
                  optionLabel="title"
                  placeholder="Chọn Tag"
                  className="w-full shadow-none custom-multiselect border border-gray-300"
                  display="chip"
                  filter
                />
              </div>
              <div className="flex justify-between mb-1">
                <h1>
                  Nội dung bài học <span className="text-red-500">*</span>
                </h1>
                <select
                  value={inputContet} // Ensure this matches with the state variable
                  onChange={handleChangeInputType} // Make sure handleChangeInputType is correctly defined
                  className="text-sm border border-gray-300 p-1 rounded-md"
                >
                  <option value={true}>Soạn bài</option>
                  <option value={false}>Tải file lên</option>
                </select>
              </div>
              {inputContet ? (
                <div>
                  <CustomEditor name="content" id="content">
                    <ErrorMessage name="content" component="div" />
                  </CustomEditor>
                </div>
              ) : (
                <div>
                  <FileUpload
                    id="content"
                    name="demo[]"
                    url={"/api/upload"}
                    accept=".pdf, application/pdf"
                    maxFileSize={10485760} // 10MB
                    emptyTemplate={
                      <p className="m-0">Drag and drop files here to upload.</p>
                    }
                    className="custom-file-upload mb-2"
                    onSelect={onFileSelect}
                    onRemove={() => setFiles([])}
                    onClear={() => setFiles([])}
                  />
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button
                  className="p-2 bg-red-500 text-white"
                  type="button"
                  severity="danger"
                  onClick={() => {
                    setVisible(false);
                  }}
                >
                  Hủy
                </Button>
                <Button className="p-2 bg-blue-500 text-white" type="submit">
                  Thêm
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </Dialog>
  );
}
