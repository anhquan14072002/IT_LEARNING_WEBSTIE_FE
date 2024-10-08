import React, { useContext, useEffect, useRef, useState } from "react";
import FormDataContext from "../../store/FormDataContext";
import restClient, { BASE_URL } from "../../services/restClient";
import Loading from "../Loading";
import axios from "axios";
import { getTokenFromLocalStorage, REJECT } from "../../utils";
import { Toast } from "primereact/toast";
import { useParams } from "react-router-dom";
function ImportStepThree(props) {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const { success, fail, idImport, idImportResult, quizId } =
    useContext(FormDataContext);
  const didFetchRef = useRef(false);
  const toast = useRef(null);
  useEffect(() => {
    if (didFetchRef.current) return;
    didFetchRef.current = true;
    setLoading(true);
    restClient({
      url: `api/quizquestion/ImportDatabase/${idImport}/${quizId}`,
      method: "GET",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${getTokenFromLocalStorage()}`,
      },
    })
      .then((res) => {
        // Handle success
      })
      .catch((err) => {
        setLoading(true);
        REJECT(toast, "Xảy ra lỗi khi nhập khẩu file excel này");
        setTimeout(() => {
          navigate("/importQuiz/stepOne");
        }, 3000);
      })
      .finally(() => setLoading(false));
  }, []);

  async function exportToExcel() {
    try {
      let res = await axios.get(
        `${BASE_URL}/api/quizquestion/ExportExcelResult/${idImportResult}`,
        {
          responseType: "arraybuffer", // Important to handle binary data
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${getTokenFromLocalStorage()}`,
          },
        }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      // Set the href attribute to the Blob URL
      link.href = url;
      let nameExcel = `Quiz_Result_${new Date()
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
  return (
    <article>
      {loading ? (
        <Loading />
      ) : (
        <div className="flex flex-col gap-3">
          <Toast ref={toast} />
          <h1 className="font-bold text-2xl">Kết quả nhập khẩu</h1>
          <p>
            Tải về tập tin chứa kết quả nhập khẩu &nbsp;
            <a
              href="#"
              className="text-blue-700 font-medium cursor-pointer"
              onClick={exportToExcel}
            >
              Tại đây
            </a>
          </p>
          <ul className="ml-5">
            <li> + Số dòng nhập khẩu thành công: {success}</li>
            <li> + Số dòng nhập khẩu không thành công: {fail}</li>
          </ul>
        </div>
      )}
    </article>
  );
}

export default ImportStepThree;
