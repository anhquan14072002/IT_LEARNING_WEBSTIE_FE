import debounce from "lodash.debounce";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import AddTopicDialog from "../AddTopicDialog";
import UpdateTopicDialog from "../UpdateTopicDialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Paginator } from "primereact/paginator";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import restClient from "../../services/restClient";
import Loading from "../Loading";
import {
  ACCEPT,
  formatDate,
  getTokenFromLocalStorage,
  REJECT,
  removeVietnameseTones,
} from "../../utils";
import { InputSwitch } from "primereact/inputswitch";
import AddQuizLesson from "../AddQuizLesson";
import UpdateQuizLesson from "../UpdateQuizLesson";
import { useNavigate } from "react-router-dom";
import { text } from "@fortawesome/fontawesome-svg-core";

export default function ManagementQuizLesson() {
  const toast = useRef(null);
  const dropDownRef1 = useRef(null);
  const dropDownRef2 = useRef(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const cm = useRef(null);
  const [visible, setVisible] = useState(false);
  const [updateValue, setUpdateValue] = useState({});
  const [visibleUpdate, setVisibleUpdate] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [textSearch, setTextSearch] = useState("");
  const navigate = useNavigate();

  //pagination
  const [first, setFirst] = useState(0);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(10);
  const [totalPage, setTotalPage] = useState(0);

  useEffect(() => {
    fetchData();
  }, [page, rows, textSearch]);

  const pagination = (page, rows) => {
    setLoading(true);

    restClient({
      url: `api/quiz/getallquizpagination?Custom=3&PageIndex=${page}&PageSize=${rows}&Value=${textSearch}`,
      method: "GET",
    })
      .then((res) => {
        const paginationData = JSON.parse(res.headers["x-pagination"]);
        setTotalPage(paginationData.TotalPages);
        setProducts(Array.isArray(res.data.data) ? res.data.data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setProducts([]);
        setLoading(false);
        setTotalPage(0)
      });
  };

  const fetchData = () => {
    // if (textSearch.trim()) {
    //   setLoading(true);
    //   restClient({
    //     url: `api/topic/searchbytopicpagination?Value=${textSearch}&PageIndex=${page}&PageSize=${rows}`,
    //     method: "GET",
    //   })
    //     .then((res) => {
    //       const paginationData = JSON.parse(res.headers["x-pagination"]);
    //       setTotalPage(paginationData.TotalPages);
    //       setProducts(Array.isArray(res.data.data) ? res.data.data : []);
    //     })
    //     .catch((err) => {
    //       console.error("Error fetching data:", err);
    //       setProducts([]);
    //     })
    //     .finally(() => setLoading(false));
    // } else {
    pagination(page, rows);
    // }
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

  const actionBodyTemplate = (rowData) => {
    return (
      <div style={{ display: "flex", gap: "2rem" }}>
        <Button
          icon="pi pi-cog"
          label="Chỉnh sửa câu hỏi ôn tập"
          className="bg-blue-600 p-mr-2 shadow-none p-2 text-white"
          onClick={() => {
            navigate("/dashboard/quiz/managequestionofquizlist/" + rowData?.id);
          }}
        />
        <Button
          icon="pi pi-pencil"
          className="text-blue-600 p-mr-2 shadow-none"
          onClick={() => {
            setUpdateValue(rowData);
            setVisibleUpdate(true);
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
      message: "Bạn có chắc chắn muốn xóa bộ câu hỏi này?",
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
      url: `api/quiz/deletequiz/${id}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getTokenFromLocalStorage()}`,
      },
    })
      .then((res) => {
        fetchData();
        ACCEPT(toast, "Xóa thành công");
      })
      .catch((err) => {
        REJECT(toast, "Xảy ra lỗi khi xóa chủ đề này");
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
      url: "api/quiz/updatestatusquiz/" + id,
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

  const status = (rowData, { rowIndex }) => {
    return (
      <InputSwitch
        checked={rowData.isActive}
        onChange={(e) => changeStatusLesson(e.value, rowData.id)}
        tooltip={rowData.isActive ? "Đã được duyệt" : "Chưa được duyệt"}
      />
    );
  };

  return (
    <div>
      <Toast ref={toast} />
      <ConfirmDialog visible={visibleDelete} />
      <AddQuizLesson
        visible={visible}
        setVisible={setVisible}
        toast={toast}
        fetchData={fetchData}
      />
      <UpdateQuizLesson
        visibleUpdate={visibleUpdate}
        setVisibleUpdate={setVisibleUpdate}
        updateValue={updateValue}
        toast={toast}
        fetchData={fetchData}
      />
      <div>
        <div className="flex justify-between pt-1">
          <h1 className="font-bold text-3xl">Bộ câu hỏi theo chủ đề , bài học</h1>
          <div>
            <Button
              label="Thêm mới"
              icon="pi pi-plus-circle"
              severity="info"
              className="bg-blue-600 text-white p-2 text-sm font-normal"
              onClick={() => setVisible(true)}
            />
            {/* <Button
              label="Xóa"
              icon="pi pi-trash"
              disabled={!selectedProduct || selectedProduct.length === 0}
              severity="danger"
              className="bg-red-600 text-white p-2 text-sm font-normal ml-3"
              onClick={() => {
                console.log("product list ::", selectedProduct);
              }}
            /> */}
          </div>
        </div>

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
          </div>
          {loading ? (
            <Loading />
          ) : (
            <>
              <DataTable
                value={products}
                loading={loading}
                className="border-t-2"
                tableStyle={{ minHeight: "30rem" }}
                selection={selectedProduct}
                onSelectionChange={(e) => setSelectedProduct(e.value)}
                scrollable
                scrollHeight="30rem"
              >
                {/* <Column
                  selectionMode="multiple"
                  headerStyle={{ width: "3rem" }}
                  className="border-b-2 border-t-2 custom-checkbox-column"
                ></Column> */}
                <Column
                  field="#"
                  header="#"
                  body={indexBodyTemplate}
                  style={{ minWidth: "5rem" }}
                  className="border-b-2 border-t-2"
                />
                <Column
                  field="title"
                  header="Tiêu đề"
                  className="border-b-2 border-t-2"
                  style={{ minWidth: "15rem" }}
                />
                <Column
                  field="topicTitle"
                  header="Chủ đề"
                  className="border-b-2 border-t-2"
                  style={{ minWidth: "15rem" }}
                />
                <Column
                  field="lessonTitle"
                  header="Bài học"
                  className="border-b-2 border-t-2"
                  style={{ minWidth: "15rem" }}
                />
                <Column
                  field="typeName"
                  header="Thể loại"
                  className="border-b-2 border-t-2"
                  style={{ minWidth: "15rem" }}
                />
        
                <Column
                  header="Trạng thái"
                  className="border-b-2 border-t-2"
                  body={status}
                  style={{ minWidth: "15rem" }}
                ></Column>
                <Column
                  field="createdDate"
                  header="Ngày tạo"
                  className="border-b-2 border-t-2"
                  style={{ minWidth: "15rem" }}
                  body={(rowData) => formatDate(rowData.createdDate)}
                />
                <Column
                  field="lastModifiedDate"
                  header="Ngày cập nhật"
                  className="border-b-2 border-t-2"
                  style={{ minWidth: "15rem" }}
                  body={(rowData) => formatDate(rowData.lastModifiedDate)}
                />
                <Column
                  className="border-b-2 border-t-2"
                  body={actionBodyTemplate}
                  style={{ minWidth: "25rem" }}
                />
              </DataTable>
              <Paginator
                first={first}
                rows={rows}
                rowsPerPageOptions={[10, 20, 30]}
                totalRecords={totalPage * rows}
                onPageChange={onPageChange}
                className="custom-paginator mx-auto"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
