import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import React, { useContext, useEffect, useRef, useState } from "react";
import FormDataContext from "../../store/FormDataContext";
import axios from "axios";
import { BASE_URL } from "../../services/restClient";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import Loading from "../Loading";
import { REJECT } from "../../utils";
import { Toast } from "primereact/toast";

import { DataTable } from "primereact/datatable";

import { Dialog } from "primereact/dialog";
function ImportStepTwo() {
  const [excelValidateResponse, setExcelValidateResponse] = useState([]);
  const { formData, file, checkRecord, idImportFail, quizId } =
    useContext(FormDataContext);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleUpload = async () => {
      if (!file) {
        setVisibleDelete(true);
        confirmDialog({
          message: "Please select a file.",
          header: "Thông báo",
          icon: "pi pi-info-circle",
          defaultFocus: "reject",
          acceptClassName: "p-button-danger",
          footer: (
            <Button
              label="Quay lại"
              className="p-2 bg-blue-500 text-white mr-2"
              onClick={() => {
                navigate("/importQuiz/stepOne");
                setVisibleDelete(false);
              }}
            />
          ),
        });
        return;
      }

      try {
        setLoading(true);
        const response = await axios.post(
          `${BASE_URL}/api/quizquestion/ImportValidate?quizId=1`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (response.status === 200) {
          const responseData = response.data.data;
          setExcelValidateResponse(responseData);
          checkRecord(
            responseData.countSuccess,
            responseData.countFail,
            responseData.idImport,
            responseData.idImportFail,
            responseData.idImportResult,
            quizId
          );
        } else {
          console.error("File upload failed:", response);
        }
      } catch (err) {

        // handleUpload();
        console.log(err.response.data.message);

        setVisible(true);
        confirmDialog({
          message: "Please select a file.",
          header: "Thông báo",
          icon: "pi pi-info-circle",
          defaultFocus: "reject",
          acceptClassName: "p-button-danger",
          footer: (
            <Button
              label="Quay lại"
              className="p-2 bg-blue-500 text-white mr-2"
              onClick={() => {
                navigate("/importQuiz/stepOne");
                setVisible(false);
              }}
            />
          ),
        });
        return;

      } finally {
        setLoading(false);
      }
    };

    handleUpload();
  }, []);

  async function exportToExcel() {
    try {
      let res = await axios.get(
        `${BASE_URL}/api/quizquestion/ExportExcelResult/${idImportResult}`,
        {
          responseType: "arraybuffer", // Important to handle binary data
        }
      );
      console.log(res);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      // Set the href attribute to the Blob URL
      link.href = url;
      let nameExcel = `Quiz_Fail_${new Date()
        .toLocaleString()
        .replace(/[\/:]/g, "-")
        .replace(/,/g, "")}.xlsx`;
      // Set the download attribute to specify the file name
      link.setAttribute("download", nameExcel);

      // Append the link to the document
      document.body.appendChild(link);

      // Programmatically click the link to trigger the download
      link.click();

      // Remove the link from the document
      link.remove();
    } catch (err) {
      console.error("Error exporting data:", err);
    }
  }
  const renderQuizAnswers = (rowData) => {
    return (
      <ul>
        {rowData.quizAnswers.map((answer, index) => (
          <li
            key={index}
            className={`${answer.isCorrect ? "font-bold " : "font-medium"}`}
          >
            - {answer.content} (Correct: {answer.isCorrect ? "Yes" : "No"})
          </li>
        ))}
      </ul>
    );
  };
  const renderErrors = (rowData) => {
    return (
      <ul>
        {rowData.errors && rowData.errors.length === 0 ? (
          <li>Hợp Lệ</li>
        ) : (
          rowData.errors &&
          rowData.errors.map((error, index) => (
            <li key={index} className="text-red-600">
              - {error}
            </li>
          ))
        )}
      </ul>
    );
  };
  const headerElement = (
    <div className="inline-flex align-items-center justify-content-center gap-2">
      {/* <Avatar
        image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
        shape="circle"
      />
      <span className="font-bold white-space-nowrap">Amy Elsner</span> */}
      <span className="font-bold white-space-nowrap ">Thông báo</span>
    </div>
  );


  const headerElement = (
    <div className="inline-flex align-items-center justify-content-center gap-2">
        {/* <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" shape="circle" /> */}
        <span className="font-bold white-space-nowrap">Thông báo</span>
    </div>
);

const footerContent = (
    <div>
        <Button className="bg-blue-500 px-3 py-2 text-white font-bold" label="Đồng ý" icon="pi pi-check"    onClick={() => {
                navigate("/importQuiz/stepOne");
                setVisible(false);
              }} autoFocus />
    </div>
);

  return loading ? (
    <Loading />
  ) : (
    <article>
      <Toast ref={toast} />
      <ConfirmDialog visible={visibleDelete} className="w-96" />

      <Dialog visible={visible} modal header={headerElement} footer={footerContent} style={{ width: '20rem' }} onHide={() => {if (!visible) return; setVisible(false); }}>
                <p className="m-0">
                  File phải đúng định dang excel
                </p>
            </Dialog>

      <p className="pb-2">
        <span className="font-bold mr-28">
          {excelValidateResponse.countSuccess ?? 0} /{" "}
          {(excelValidateResponse.countSuccess ?? 0) +
            (excelValidateResponse.countFail ?? 0)}
          dòng hợp lệ
        </span>
        <span className="font-bold ">
          {excelValidateResponse.countFail ?? 0} /{" "}
          {(excelValidateResponse.countSuccess ?? 0) +
            (excelValidateResponse.countFail ?? 0)}{" "}
          dòng không hợp lệ
        </span>
      </p>
      <div className="card overflow-auto">
        <DataTable
          value={excelValidateResponse.quizQuestionImportDtos}
          scrollable
          scrollHeight="68vh"
          tableStyle={{ minWidth: "100rem" }}
          className="border-2"
        >
          <Column
            field="content"
            header="Câu hỏi"
            frozen
            style={{ width: "200px" }}
            className="font-bold border-b-2 border-t-2"
          />
          <Column
            field="typeName"
            header="Loại câu hỏi"
            className="border-b-2 border-t-2"
          />
          <Column
            field="quizAnswers"
            header="Quiz Answers"
            body={renderQuizAnswers}
            className="border-b-2 border-t-2"
          />
          <Column
            field="questionLevelName"
            header="Cấp độ câu hỏi"
            className="border-b-2 border-t-2"
          />
          <Column
            field="isShuffle"
            body={(rowData) => (rowData.isShuffle ? "Có" : "Không")}
            header="Trộn câu hỏi"
            className="border-b-2 border-t-2"
          />
          <Column
            field="hint"
            header="Gợi ý câu hỏi"
            className="border-b-2 border-t-2"
          />
          <Column
            field="errors"
            header="Tình trạng"
            body={renderErrors}
            className="border-b-2 border-t-2"
          />
        </DataTable>
      </div>
      {/* <DataTable data={excelValidateResponse.quizQuestionImportDtos || []} /> */}
      <p className="pt-2">
        Tải về tập tin chứa các dòng nhập liệu không thành công
        <a
          className="text-blue-700 font-medium"
          onClick={exportToExcel}
        >
          &nbsp; Tại đây
        </a>
      </p>
    </article>
  );
}

export default ImportStepTwo;
