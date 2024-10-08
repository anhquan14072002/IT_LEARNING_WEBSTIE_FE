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
// import AddTag from "../AddTag";
import UpdateQuizLesson from "../UpdateQuizLesson";
import AddTag from "../AddTag";
import UpdateTag from "../UpdateTag";

export default function ManagementQuizLesson() {
  const toast = useRef(null);
  const dropDownRef2 = useRef(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [visible, setVisible] = useState(false);
  const [updateValue, setUpdateValue] = useState({});
  const [visibleUpdate, setVisibleUpdate] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [textSearch, setTextSearch] = useState("");
  //pagination
  const [first, setFirst] = useState(0);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(10);
  const [totalPage, setTotalPage] = useState(0);

  useEffect(() => {
    fetchData();
  }, [page, rows, textSearch]);
  
  const fetchData = () => {
    setLoading(true);
  
    restClient({
      url: `api/tag/getalltagpagination?PageIndex=${page}&PageSize=${rows}&Value=${textSearch}`,
      method: "GET",
    })
      .then((res) => {
        const paginationData = res.headers["x-pagination"]
          ? JSON.parse(res.headers["x-pagination"])
          : { TotalPages: 0 };
        setTotalPage(paginationData.TotalPages);
        setProducts(Array.isArray(res.data.data) ? res.data.data : []);
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
  
  const actionBodyTemplate = (rowData) => {
    return (
      <div style={{ display: "flex" }}>
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
      message: "Bạn có chắc chắn muốn xóa tag này?",
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
              deleteTag(id);
            }}
          />
        </>
      ),
    });
  };
  
  const deleteTag = async (id) => {
    await restClient({ url: `api/tag/deletetag/${id}`, method: "DELETE" })
      .then((res) => {
        fetchData();
        ACCEPT(toast, "Xóa thành công");
      })
      .catch((err) => {
        REJECT(toast, "Xảy ra lỗi khi xóa tag này");
      })
      .finally(() => {
        setVisibleDelete(false);
      });
  };
  
  const handleSearchInput = debounce((text) => {
    console.log(text);
    setTextSearch(text);
  }, 300);
  
  const changeStatusTag = async (value, id) => {
    console.log(value, id);
    await restClient({
      url: `api/tag/updatestatustag/${id}`,
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
        onChange={(e) => changeStatusTag(e.value, rowData.id)}
        tooltip={rowData.isActive ? "Đã được duyệt" : "Chưa được duyệt"}
      />
    );
  };
  

  return (
    <div>
      <Toast ref={toast} />
      <ConfirmDialog visible={visibleDelete} />
      <AddTag
        visible={visible}
        setVisible={setVisible}
        toast={toast}
        fetchData={fetchData}
      />
      <UpdateTag
        visibleUpdate={visibleUpdate}
        setVisibleUpdate={setVisibleUpdate}
        updateValue={updateValue}
        toast={toast}
        fetchData={fetchData}
      />
      <div>
        <div className="flex justify-between pt-1">
          <h1 className="font-bold text-3xl">Danh sách các Tag</h1>
          <div>
            <Button
              label="Thêm mới"
              icon="pi pi-plus-circle"
              severity="info"
              className="bg-blue-600 text-white p-2 text-sm font-normal"
              onClick={() => setVisible(true)}
            />
          </div>
        </div>

        <div className="border-2 rounded-md mt-2">
          <div className="mb-10 flex flex-wrap items-center p-2">
            <div className="border-2 rounded-md p-2">
              <InputText
                onChange={(e) => {
                  handleSearchInput(e.target.value);
                }}
                placeholder="Tìm Kiếm"
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
                <Column
                  field="#"
                  header="#"
                  body={indexBodyTemplate}
                  className="border-b-2 border-t-2"
                  style={{ width: "5%" }}
                />
                <Column
                  field="title"
                  header="Tiêu đề"
                  className="border-b-2 border-t-2"
                  style={{ width: "30%" }}
                />
                <Column
                  header="Trạng thái"
                  className="border-b-2 border-t-2"
                  body={status}
                  style={{ width: "15%" }}
                ></Column>
                <Column
                  field="createdDate"
                  header="Ngày Tạo"
                  className="border-b-2 border-t-2"
                  style={{ width: "20%" }}
                  body={(rowData) => formatDate(rowData.createdDate)}
                />
                <Column
                  field="lastModifiedDate"
                  header="Ngày cập nhật"
                  className="border-b-2 border-t-2"
                  style={{ width: "20%" }}
                  body={(rowData) => formatDate(rowData.lastModifiedDate)}
                />
                <Column
                  className="border-b-2 border-t-2"
                  body={actionBodyTemplate}
                  style={{ width: "10%" }}
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
