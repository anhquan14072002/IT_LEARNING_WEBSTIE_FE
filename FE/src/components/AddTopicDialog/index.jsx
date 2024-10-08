import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import CustomTextInput from "../../shared/CustomTextInput";
import CustomSelectInput from "../../shared/CustomSelectInput";
import CustomTextarea from "../../shared/CustomTextarea";
import "./index.css";
import { Button } from "primereact/button";
import CustomEditor from "../../shared/CustomEditor";
import { REJECT, SUCCESS } from "../../utils";
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
  objectives: Yup.string()
    .trim()
    .required("Mục tiêu chủ đề không được bỏ trống")
    .min(5, "Mục tiêu chủ đề phải có ít nhất 5 ký tự")
    .max(250, "Mục tiêu chủ đề không được vượt quá 250 ký tự"),
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
});

export default function AddTopicDialog({
  visible,
  setVisible,
  toast,
  fetchData,
}) {
  const [initialValues, setInitialValues] = useState({
    title: "",
    objectives: "",
    grade: {},
    description: "",
    document: {},
  });
  const [documentList, setDocumentList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [gradeList, setListGrade] = useState([]);
  const [tagList, setTagList] = useState([]);
  const [tag, setTag] = useState(null);
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

  // useEffect(() => {
  //   restClient({ url: "api/document/getalldocument", method: "GET" })
  //     .then((res) => {
  //       setDocumentList(Array.isArray(res.data.data) ? res.data.data : []);
  //     })
  //     .catch((err) => {
  //       setDocumentList([]);
  //     });
  // }, []);
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
    setLoading(true);
    // const tagValues = tag.map((item) => item.keyWord);

    // Ensure tag is always an array
    const tagValues = (tag || []).map((item) => item.keyWord);

    let model;

    // Check if tagValues is empty
    if (tagValues.length === 0) {
      model = {
        title: values.title,
        objectives: values.objectives,
        description: values.description,
        documentId: values.document.id,
        isActive: true,
      };
    } else if (tagValues.length > 0) {
      model = {
        title: values.title,
        objectives: values.objectives,
        description: values.description,
        documentId: values.document.id,
        tagValues: tagValues,
        isActive: true,
      };
    }
    restClient({
      url: "api/topic/createtopic",
      method: "POST",
      data: model,
    })
      .then((res) => {
        SUCCESS(toast, "Thêm chủ đề thành công");
        setTag([]);
        fetchData();
        setLoading(false);
      })
      .catch((err) => {
        REJECT(toast, err.message);
        setTag([]);
        setLoading(false);
      })
      .finally(() => {
        setVisible(false);
      });
  };

  const handleOnChangeGrade = (e, helpers, setTouchedState, props) => {
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

  return (
    <Dialog
      header="Thêm chủ đề"
      visible={visible}
      style={{ width: "50vw" }}
      onHide={() => {
        if (!visible) return;
        setVisible(false);
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

              <CustomDropdown
                title="Chọn tài liệu"
                label="Tài liệu"
                name="document"
                id="document"
                disabled={!documentList || documentList.length === 0}
                options={documentList}
              />
              <CustomTextInput
                label="Tiêu đề"
                name="title"
                type="text"
                id="title"
              />
              <CustomTextarea
                label="Mục tiêu chủ đề"
                name="objectives"
                id="objectives"
              >
                <ErrorMessage name="objectives" component="div" />
              </CustomTextarea>
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
                  onClick={() => setVisible(false)}
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
