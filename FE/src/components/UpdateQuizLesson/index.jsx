import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import CustomTextInput from "../../shared/CustomTextInput";
import CustomSelectInput from "../../shared/CustomSelectInput";
import CustomTextarea from "../../shared/CustomTextarea";
import { Button } from "primereact/button";
import CustomEditor from "../../shared/CustomEditor";
import { getTokenFromLocalStorage, REJECT, SUCCESS } from "../../utils";
import restClient from "../../services/restClient";
import Loading from "../Loading";
import { Dropdown } from "primereact/dropdown";
import CustomDropdown from "../../shared/CustomDropdown";
import CustomDropdownInSearch from "../../shared/CustomDropdownInSearch";
import { MultiSelect } from "primereact/multiselect";

const validationSchema = Yup.object({
  title: Yup.string()
    .trim()
    .required("Tiêu đề không được bỏ trống")
    .min(5, "Tiêu đề phải có ít nhất 5 ký tự")
    .max(50, "Tiêu đề không được vượt quá 50 ký tự"),
  description: Yup.string().required("Mô tả không được bỏ trống"),
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
  topic: Yup.object()
    .test("is-not-empty", "Không được để trống trường này", (value) => {
      return Object.keys(value).length !== 0; // Check if object is not empty
    })
    .required("Không bỏ trống trường này"),
  lesson: Yup.object().nullable(),
});

export default function UpdateQuizLesson({
  visibleUpdate,
  setVisibleUpdate,
  updateValue,
  toast,
  fetchData,
}) {
  const [initialValues, setInitialValues] = useState({
    title: "",
    grade: {},
    description: "",
    document: {},
    topic: {},
    lesson: {},
  });
  const [documentList, setDocumentList] = useState([]);
  const [topicList, setListTopic] = useState([]);
  const [loading, setLoading] = useState(false);
  const [gradeList, setListGrade] = useState([]);
  const [clearTopic, setClearTopic] = useState(false);
  const [clearGrade, setClearGrade] = useState(false);
  const [clearLesson, setClearLesson] = useState(false);
  const [lessonList, setLessonList] = useState([]);
  const [typeList, setTypeList] = useState([]);

  const [tagList, setTagList] = useState([]);
  const [tag, setTag] = useState(null);

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

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        console.log(updateValue);
        let lessonByIdData;
        if (updateValue && updateValue.lessonId) {
          const lessonById = await restClient({
            url: `api/lesson/getlessonbyid/${updateValue.lessonId}`,
            method: "GET",
          });
          lessonByIdData = lessonById.data?.data || {};

          setInitialValues((prevValues) => ({
            ...prevValues,
            lesson: lessonByIdData,
          }));
        } else {
          setInitialValues((prevValues) => ({
            ...prevValues,
            lesson: {},
          }));
        }

        // Fetch type quizzes
        const typeQuizResponse = await restClient({
          url: `api/enum/gettypequiz`,
          method: "GET",
        });
        const transformedData = typeQuizResponse?.data?.data?.map((item) => ({
          title: item?.name,
          id: item?.value,
        }));
        setTypeList(transformedData);

        const typeFind = transformedData?.find(
          (item, index) => item?.title === updateValue?.type
        );

        let selectTopicById;
        if (lessonByIdData) {
          const topicById = await restClient({
            url: `api/topic/gettopicbyid?id=${lessonByIdData?.topicId}`,
            method: "GET",
          });
          selectTopicById = topicById.data?.data || {};
          setInitialValues((prevValues) => ({
            ...prevValues,
            topic: selectTopicById,
          }));
        } else if (!lessonByIdData) {
          const topicById = await restClient({
            url: `api/topic/gettopicbyid?id=${updateValue?.topicId}`,
            method: "GET",
          });
          selectTopicById = topicById.data?.data || {};
          setInitialValues((prevValues) => ({
            ...prevValues,
            topic: selectTopicById,
          }));
        }

        const documentById = await restClient({
          url: `api/document/getdocumentbyid/${selectTopicById.documentId}`,
          method: "GET",
        });
        const documentByIdData = documentById.data?.data || {};

        const gradeById = await restClient({
          url: `api/grade/getgradebyid/${documentByIdData.gradeId}`,
          method: "GET",
        });
        const gradeByIdData = gradeById.data?.data || {};

        setInitialValues((prevValues) => ({
          ...prevValues,
          title: updateValue.title,
          grade: gradeByIdData,
          description: updateValue.description,
          document: documentByIdData,
          score: updateValue.score,
          type: typeFind,
        }));

        const gradeAllResponse = await restClient({
          url: `api/grade/getallgrade?isInclude=false`,
          method: "GET",
        });
        const listGrade = gradeAllResponse.data?.data || [];
        setListGrade(listGrade);

        const documentData = await restClient({
          url: `api/document/getalldocumentbygrade/${gradeByIdData.id}`,
          method: "GET",
        });
        const documentRes = documentData.data?.data || {};
        setDocumentList(documentRes);

        const topicData = await restClient({
          url: `api/topic/getalltopicbydocument/${documentByIdData.id}`,
          method: "GET",
        });
        const dataTopic = topicData.data?.data || {};
        setListTopic(dataTopic);

        const lessonData = await restClient({
          url: `api/lesson/getalllessonbytopic/${selectTopicById.id}`,
          method: "GET",
        });
        const dataLesson = lessonData.data?.data || {};
        setLessonList(dataLesson);

        try {
          const tagTopic = await restClient({
            url: `api/quiz/getquizidbytag/${updateValue?.id}`,
            method: "GET",
          });
          setTag(tagTopic?.data?.data || null);
        } catch (error) {
          setTag(null);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (visibleUpdate) {
      fetchInitialData();
    }
  }, [visibleUpdate, updateValue]);

  const onSubmit = (values) => {
    // {
    //     "title": "string",
    //     "description": "string",
    //     "score": 0,
    //     "isActive": true,
    //     "topicId": 0,
    //     "lessonId": 0
    //   }

    // Ensure tag is always an array
    const tagValues = (tag || []).map((item) => item.keyWord);

    let model = {
      id: updateValue.id,
      title: values.title,
      type: 1,
      description: values.description,
      score: 10,
      gradeId: values?.grade?.id,
      topicId: values.topic.id,
      tagValues,
      isActive: true,
    };
    if (values.lesson && values.lesson.id) {
      model = {
        id: updateValue.id,
        title: values.title,
        type: 1,
        description: values.description,
        gradeId: values?.grade?.id,
        score: 10,
        topicId: null,
        lessonId: values.lesson.id,
        isActive: true,
      };
    }
    console.log("model: " + model);
    restClient({
      url: "api/quiz/updatequiz",
      method: "PUT",
      data: model,
    })
      .then((res) => {
        SUCCESS(toast, "Cập nhật bài quiz thành công");
        fetchData();
        setLoading(false);
      })
      .catch((err) => {
        REJECT(toast, err.message);
        setLoading(false);
      })
      .finally(() => {
        setVisibleUpdate(false);
      });
  };

  const handleOnChangeGrade = (e, helpers, setTouchedState, props) => {
    setClearGrade(true);
    setClearTopic(true);
    setClearLesson(true);
    setDocumentList([]);
    setListTopic([]);
    setLessonList([]);
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
        setDocumentList(res.data.data || []);
      })
      .catch((err) => {
        setDocumentList([]);
      });
  };

  const handleOnChangeDocument = (e, helpers, setTouchedState, props) => {
    setClearTopic(true);
    setClearLesson(true);
    setListTopic([]);
    setLessonList([]);
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

  const handleOnChangeTopic = (e, helpers, setTouchedState, props) => {
    setClearLesson(true);
    setLessonList([]);
    if (!e.target.value || !e.target.value.id) {
      setLessonList([]);
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
      url: `api/lesson/getalllessonbytopic/` + e.target.value.id,
      method: "GET",
    })
      .then((res) => {
        setLessonList(res.data.data || []);
      })
      .catch((err) => {
        setLessonList([]);
      });
  };

  return (
    <Dialog
      header="Cập nhật bộ câu hỏi theo chủ đề , bài học"
      visible={visibleUpdate}
      style={{ width: "50vw" }}
      onHide={() => {
        if (!visibleUpdate) return;
        setVisibleUpdate(false);
      }}
    >
      {loading === true ? (
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
                isClear={true}
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

              <CustomDropdownInSearch
                title="Chọn chủ đề"
                label="Chủ đề"
                name="topic"
                id="topic"
                isClear={true}
                touched={false}
                clearGrade={clearTopic}
                setClearGrade={setClearTopic}
                disabled={!topicList || topicList.length === 0}
                handleOnChange={handleOnChangeTopic}
                options={topicList}
              />

              <CustomDropdown
                title="Chọn bài học"
                label="Bài học"
                name="lesson"
                id="lesson"
                touched={false}
                isNotRequired={true}
                clearTopic={clearLesson}
                setClearTopic={setClearLesson}
                disabled={!lessonList || lessonList.length === 0}
                options={lessonList}
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

              <div>
                <CustomEditor
                  label="Thông tin chi tiết"
                  name="description"
                  id="description"
                >
                  <ErrorMessage name="description" component="div" />
                </CustomEditor>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  className="p-2 bg-red-500 text-white"
                  type="button"
                  severity="danger"
                  onClick={() => setVisibleUpdate(false)}
                >
                  Hủy
                </Button>
                <Button className="p-2 bg-blue-500 text-white" type="submit">
                  Cập nhật
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </Dialog>
  );
}
