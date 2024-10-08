import debounce from "lodash.debounce";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Paginator } from "primereact/paginator";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import restClient from "../../services/restClient";
import Loading from "../../components/Loading";
import {
  ACCEPT,
  decodeBase64,
  getTokenFromLocalStorage,
  REJECT,
} from "../../utils";
import { InputSwitch } from "primereact/inputswitch";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import { Tooltip } from "primereact/tooltip";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/python/python";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import NotifyProvider from "../../store/NotificationContext";
import { useSelector } from "react-redux";
import { assets } from "../../assets/assets";

export default function ManageExecuteCode() {
  const toast = useRef(null);
  const dropDownRef1 = useRef(null);
  const dropDownRef2 = useRef(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [visibleImport, setVisibleImport] = useState(false);
  const [updateValue, setUpdateValue] = useState({});
  const [visibleUpdate, setVisibleUpdate] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [textSearch, setTextSearch] = useState("");
  const { id } = useParams();

  //pagination
  const [first, setFirst] = useState(0);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(10);
  const [totalPage, setTotalPage] = useState(0);

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.value);
  const Menus = [
    // Admin specific menus
    ...(user.role === "Admin"
      ? [
          {
            title: "Thống kê",
            src: assets.chart_fill,
            icon: "pi pi-chart-bar",
            index: "statistic",
          },
          {
            title: "Quản lí tài khoản",
            src: assets.user,
            icon: "pi pi-user",
            index: "user",
          },

          {
            title: "Quản lí tài liệu/chủ đề/bài học",
            src: assets.folder,
            icon: "pi pi-book",
            index: "adminManageDocument",
          },
        ]
      : []),

    // Content Manager specific menus
    ...(user.role === "ContentManager"
      ? [
          {
            title: "Quản lí bài học",
            src: assets.folder,
            icon: "pi pi-book",
            index: "lesson",
          },
        ]
      : []),

    // Common menus
    {
      title: "Quản lí câu hỏi ôn tập",
      src: assets.folder,
      icon: "pi pi-question-circle",
      index: "quiz",
    },
    {
      title: "Quản lí đề thi",
      src: assets.folder,
      icon: "pi pi-file",
      index: "test",
    },
    {
      title: "Quản lí tag",
      src: assets.folder,
      icon: "pi pi-tag",
      index: "tag",
    },
    {
      title: "Quản lí bài thực hành",
      src: assets.folder,
      icon: "pi pi-ticket",
      index: "codeeditor",
    },
  ];

  useEffect(() => {
    fetchData();
  }, [page, rows, textSearch]);

  const fetchData = () => {
    setLoading(true);

    restClient({
      url: `api/executecode/getallexecutecodebyproblemid/${id}`,
      method: "GET",
    })
      .then((res) => {
        const data = res.data.data;
        setProducts(Array.isArray(data) ? data : []);
        // Optional: handle pagination metadata if provided
        // const paginationData = JSON.parse(res.headers["x-pagination"]);
        // setTotalPage(paginationData.TotalPages);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setProducts([]);
        setLoading(false);
      });
  };

  const onPageChange = (event) => {
    const { page, rows, first } = event;
    setRows(rows);
    setPage(page + 1);
    setFirst(first);
  };

  const indexBodyTemplate = (rowData, { rowIndex }) => {
    const index = (page - 1) * rows + (rowIndex + 1);
    return <span>{index}</span>;
  };

  const libraryTemplate = (rowData) => {
    return (
      <CodeMirror
        value={decodeBase64(rowData?.libraries)}
        options={{
          theme: "material",
          lineNumbers: true,
        }}
      />
    );
  };

  const contentBodyTemplate = (rowData) => {
    return (
      <CodeMirror
        value={decodeBase64(rowData?.mainCode)}
        options={{
          theme: "material",
          lineNumbers: true,
        }}
      />
    );
  };

  const samplecode = (rowData) => {
    return (
      <CodeMirror
        value={decodeBase64(rowData?.sampleCode)}
        options={{
          theme: "material",
          lineNumbers: true,
        }}
      />
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div style={{ display: "flex" }}>
        <Button
          icon="pi pi-pencil"
          className="text-blue-600 p-mr-2 shadow-none"
          onClick={() => {
            navigate('/dashboard/updateexecutecode/'+rowData?.id)
          }}
        />
        <Button
          icon="pi pi-trash"
          className="text-red-600 shadow-none"
          onClick={() => {
            confirmDelete(rowData.id);
          }}
        />
      </div>
    );
  };

  const confirmDelete = (id) => {
    setVisibleDelete(true);
    confirmDialog({
      message: "Bạn có chắc chắn muốn xóa mã thực thi này?",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      footer: (
        <>
          <Button
            label="Hủy"
            icon="pi pi-times"
            className="p-2 bg-red-500 text-white mr-2"
            onClick={() => {
              setVisibleDelete(false);
            }}
          />
          <Button
            label="Xóa"
            icon="pi pi-check"
            className="p-2 bg-blue-500 text-white"
            onClick={() => {
              deleteDocument(id);
            }}
          />
        </>
      ),
    });
  };

  const deleteDocument = (id) => {
    restClient({
      url: `api/executecode/deleteexecutecode/${id}`,
      method: "DELETE",
    })
      .then((res) => {
        fetchData();
        ACCEPT(toast, "Xóa thành công");
      })
      .catch((err) => {
        REJECT(toast, "Xảy ra lỗi khi xóa mã thực thi này");
      })
      .finally(() => {
        setVisibleDelete(false);
      });
  };

  const handleSearchInput = debounce((text) => {
    setTextSearch(text);
  }, 300);

  const changeStatusLesson = (value, id) => {
    restClient({
      url: `api/executecode/updatestatus/${id}`,
      method: "PUT",
      headers: {
        Authorization: `Bearer ${getTokenFromLocalStorage()}`,
      },
    })
      .then((res) => {
        ACCEPT(toast, "Thay đổi trạng thái thành công");
        fetchData();
      })
      .catch((err) => {
        REJECT(toast, "Lỗi khi thay đổi trạng thái");
      });
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <InputSwitch
        checked={rowData?.isActive}
        onChange={(e) => changeStatusLesson(e.value, rowData.id)}
        tooltip={rowData.isActive ? "Đã được duyệt" : "Chưa được duyệt"}
      />
    );
  };

  return (
    <NotifyProvider>
      <div className="fixed top-0 w-full z-30">
        <Header />
      </div>
      <div className="fixed left-0 top-16 z-20">
            <div
              className={`${
                open ? "w-72" : "w-20"
              } bg-dark-purple h-screen p-5 pt-8 duration-300`}
            >
              <i
                className={`pi pi-arrow-circle-right text-white text-xl  absolute cursor-pointer right-2 top-7 w-7 
   rounded-full ${!open ? "rotate-180" : ""}`}
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
                {Menus.map((Menu) => (
                  <li
                    key={Menu.index}
                    className={`flex rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 mt-2
                    }`}
                    onClick={() => {
                      navigate(`/dashboard/${Menu.index}`);
                    }}
                  >
                    <Tooltip
                      target={`#tooltip-${Menu.index}`}
                      content={Menu.title}
                    />
                    <i id={`tooltip-${Menu.index}`} className={Menu.icon}></i>

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
        <div className="h-screen">
          <div>
            <Toast ref={toast} />
            <ConfirmDialog visible={visibleDelete} />
            <div>
              <div className="flex justify-between pt-1">
                <h1 className="font-bold text-3xl">Quản lý mã thực thi</h1>
                <div className="flex gap-5">
                  <Button
                    label="Thêm mã thực thi"
                    icon="pi pi-plus-circle"
                    severity="info"
                    className="bg-blue-600 text-white p-2 text-sm font-normal"
                    onClick={() => navigate("/dashboard/createcode/" + id)}
                  />
                </div>
              </div>

              <div className="border-2 rounded-md mt-2">
                
                {loading ? (
                  <Loading />
                ) : (
                  <>
                    <DataTable
                      value={products}
                      loading={loading}
                      className="border-t-2"
                      tableStyle={{ minHeight: "30rem" }}
                      scrollable
                      scrollHeight="30rem"
                    >
                      <Column
                        field="#"
                        header="#"
                        body={indexBodyTemplate}
                        className="border-b-2 border-t-2"
                      />
                       <Column
                        header="Import thư viện"
                        body={libraryTemplate}
                        className="border-b-2 border-t-2"
                        style={{ minWidth: "35rem" }}
                      />
                      <Column
                        header="Mã chính"
                        body={contentBodyTemplate}
                        className="border-b-2 border-t-2"
                        style={{ minWidth: "35rem" }}
                      />
                      <Column
                        header="Mã mẫu"
                        body={samplecode}
                        className="border-b-2 border-t-2"
                        style={{ minWidth: "35rem" }}
                      />
                      <Column
                        header="Ngôn ngữ"
                        field="languageName"
                        className="border-b-2 border-t-2"
                        style={{ minWidth: "15rem" }}
                      />
                      {/* <Column
                        header="Trạng thái"
                        className="border-b-2 border-t-2"
                        body={statusBodyTemplate}
                        style={{ minWidth: "15rem" }}
                      ></Column> */}
                      <Column
                        className="border-b-2 border-t-2"
                        body={actionBodyTemplate}
                        style={{ minWidth: "15rem" }}
                      />
                    </DataTable>
                    
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </NotifyProvider>
  );
}
