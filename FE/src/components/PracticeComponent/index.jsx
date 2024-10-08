import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import React, { useEffect, useRef, useState } from "react";
import Loading from "../Loading";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Paginator } from "primereact/paginator";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
import restClient from "../../services/restClient";
import { InputText } from "primereact/inputtext";
import {
  ACCEPT,
  getTokenFromLocalStorage,
  REJECT,
  removeVietnameseTones,
} from "../../utils";
import { confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { InputSwitch } from "primereact/inputswitch";

export default function PracticeComponent() {
  const toast = useRef(null);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const cm = useRef(null);
  const [loading, setLoading] = useState(false);
  const [modelUpdate, setModelUpdate] = useState({});
  const [textSearch, setTextSearch] = useState("");
  const [loadingDeleteMany, setLoadingDeleteMany] = useState(false);
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [content, setContent] = useState("");
  const [visibleDelete, setVisibleDelete] = useState(false);
  const navigate = useNavigate();
  const [navIndex, setNavIndex] = useState(1);

  //pagination
  const [first, setFirst] = useState(0);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(10);
  const [totalPage, setTotalPage] = useState(0);

  useEffect(() => {
    fetchData(page, rows);
  }, [page, rows, textSearch]);

  const getData = () => {
    fetchData(page, rows);
  };

  const fetchData = (page, rows) => {
    if (textSearch.trim()) {
      setLoading(true);
      restClient({
        url: `api/problem/getallproblempagination?Value=${textSearch.trim()}&PageIndex=${page}`,
        method: "GET",
      })
        .then((res) => {
          const paginationData = JSON.parse(res.headers["x-pagination"]);
          setTotalPage(paginationData.TotalPages);
          setProducts(Array.isArray(res.data.data) ? res.data.data : []);
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
          setProducts([]);
          setTotalPage(0);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(true);

      restClient({
        url: `api/problem/getallproblempagination?PageIndex=${page}`,
        method: "GET",
      })
        .then((res) => {
          const paginationData = JSON.parse(res.headers["x-pagination"]);
          setTotalPage(paginationData.TotalPages);
          setProducts(Array.isArray(res.data.data) ? res.data.data : []);
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
          setProducts([]);
          setTotalPage(0);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const actionBodyTemplate = (rowData) => {
    const handleDelete = (id) => {
      if (window.confirm("Bạn có chắc chắn muốn xóa bài này?")) {
        deleteLesson(id); // Call the delete function here
      }
    };

    return (
      <div style={{ display: "flex" }}>
        <Button
          icon="pi pi-pencil"
          className="text-blue-600 p-mr-2 shadow-none"
          onClick={() => {
            navigate(`/dashboard/updateproblem/${rowData?.id}`);
          }}
        />
        <Button
          icon="pi pi-trash"
          className="text-red-600 shadow-none"
          onClick={() => handleDelete(rowData.id)}
        />
      </div>
    );
  };

  const cities = [
    { name: "New York", code: "NY" },
    { name: "Rome", code: "RM" },
    { name: "London", code: "LDN" },
    { name: "Istanbul", code: "IST" },
    { name: "Paris", code: "PRS" },
  ];

  const onPageChange = (event) => {
    const { page, rows, first } = event;
    setPage(page + 1);
    setRows(rows);
    setFirst(first);
  };

  const indexBodyTemplate = (rowData, { rowIndex }) => {
    const index = (page - 1) * rows + (rowIndex + 1);
    return <span>{index}</span>;
  };

  const navigateExecuteCode = (rowData, { rowIndex }) => {
    // return <InputSwitch checked={rowData.isActive} />;
    return (
      <button
        className="bg-blue-600 hover:bg-blue-400 text-white p-2 rounded-md"
        onClick={() =>
          navigate(`/dashboard/quiz/manageexecutecode/${rowData?.id}`)
        }
      >
        Chỉnh sửa mã thực thi
      </button>
    );
  };

  const changeStatusLesson = (value, id) => {
    restClient({
      url: "api/problem/updatestatusproblem/" + id,
      method: "PUT",
    })
      .then((res) => {
        ACCEPT(toast, "Thay đổi trạng thái thành công");
        getData();
      })
      .catch((err) => {
        REJECT(toast, "Lỗi khi thay đổi trạng thái");
      });
  };

  const status = (rowData, { rowIndex }) => {
    return (
      <InputSwitch
        checked={rowData.isActive}
        onChange={(e) => changeStatusLesson(e.value, rowData.id)}
        tooltip={
          rowData.isActive ? "Bài này đã được duyệt" : "Bài chưa được duyệt"
        }
      />
    );
  };

  const description = (rowData, { rowIndex }) => {
    return <p dangerouslySetInnerHTML={{ __html: rowData?.description }}></p>;
  };

  const handleOpenDialog = (content) => {
    setContent(content);
    setVisibleDialog(true);
  };

  const deleteLesson = (id) => {
    restClient({ url: `api/problem/deleteproblem/${id}`, method: "DELETE" })
      .then((res) => {
        getData();
        ACCEPT(toast, "Xóa thành công");
      })
      .catch((err) => {
        REJECT(toast, "Xảy ra lỗi khi xóa tài liệu này");
      })
      .finally(() => {});
  };

  const handleSearchInput = debounce((text) => {
    setTextSearch(text);
  }, 300);
  return (
    <div>
      <div className="flex justify-between pt-1">
        <Toast ref={toast} />
        <h1 className="font-bold text-3xl">Quản lí các bài thực hành</h1>
        <div>
          <Button
            label="Thêm mới"
            icon="pi pi-plus-circle"
            severity="info"
            className="bg-blue-600 text-white p-2 text-sm font-normal"
            onClick={() => navigate("/dashboard/createproblem")}
          />
        </div>
      </div>

      {/* data */}
      <div className="border-2 rounded-md mt-2">
        <div className="mb-10 flex flex-wrap items-center p-2">
          <div className="border-2 rounded-md p-2">
            <InputText
              onChange={(e) => {
                handleSearchInput(e.target.value);
              }}
              placeholder="Tìm kiếm"
              className="flex-1 focus:outline-none w-36 focus:ring-0"
            />
            <Button
              icon="pi pi-search"
              className="p-button-warning focus:outline-none focus:ring-0 flex-shrink-0"
            />
          </div>

          {/* <div className="flex-1 flex flex-wrap gap-3 justify-end">
              <div className="border-2 rounded-md mt-4">
                <Dropdown
                  filter
                  ref={dropDownRef2}
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.value)}
                  options={cities}
                  optionLabel="name"
                  showClear
                  placeholder="Lớp"
                  className="w-full md:w-14rem shadow-none h-full"
                />
              </div>
              <div className="border-2 rounded-md mt-4">
                <Dropdown
                  filter
                  ref={dropDownRef2}
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.value)}
                  options={cities}
                  optionLabel="name"
                  showClear
                  placeholder="Bộ sách"
                  className="w-full md:w-14rem shadow-none h-full"
                />
              </div>
              <div className="border-2 rounded-md mt-4">
                <Dropdown
                  filter
                  ref={dropDownRef2}
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.value)}
                  options={cities}
                  optionLabel="name"
                  showClear
                  placeholder="Chủ đề"
                  className="w-full md:w-14rem shadow-none h-full"
                />
              </div>
            </div> */}
        </div>
        {loading ? (
          <Loading />
        ) : (
          <DataTable
            value={products}
            onContextMenu={(e) => cm.current.show(e.originalEvent)}
            selection={selectedProduct}
            onSelectionChange={(e) => setSelectedProduct(e.value)}
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
              style={{ minWidth: "5rem" }}
            />

            <Column
              field="title"
              header="Tiêu đề"
              className="border-b-2 border-t-2"
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              body={description}
              header="Nội dung"
              className="border-b-2 border-t-2"
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              header="Độ khó"
              className="border-b-2 border-t-2"
              field="difficultyName"
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              header="Trạng thái"
              className="border-b-2 border-t-2"
              body={status}
              style={{ minWidth: "10rem" }}
            ></Column>
            <Column
              className="border-b-2 border-t-2"
              body={navigateExecuteCode}
              style={{ minWidth: "10rem" }}
            ></Column>
            <Column
              className="border-b-2 border-t-2"
              body={actionBodyTemplate}
            />
          </DataTable>
        )}
        <Paginator
          first={first}
          rows={rows}
          totalRecords={totalPage * rows}
          onPageChange={onPageChange}
          className="custom-paginator mx-auto"
        />
      </div>
    </div>
  );
}
