import React, { useEffect, useRef, useState } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Menu from "../../components/Menu";
import CategoryOfClass from "../../components/CategoryOfClass";
import CustomCard from "../../components/CustomCard";
import { Paginator } from "primereact/paginator";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import restClient from "../../services/restClient";
import CustomQuiz from "../../components/CustomQuiz";
import NotifyProvider from "../../store/NotificationContext";
import { removeVietnameseTones } from "../../utils";

export default function SearchQuiz() {
  const footerRef = useRef(null);
  const fixedDivRef = useRef(null);
  const dropDownRef1 = useRef(null);
  const dropDownRef2 = useRef(null);
  const [fixedDivHeight, setFixedDivHeight] = useState(0);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const [classId, setClassId] = useState();
  const [type, setType] = useState();
  const [listGrade, setListGrade] = useState([]);

  //document
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [textSearch, setTextSearch] = useState(
    Object.fromEntries(params.entries()).text || ""
  );

  //pagination
  const [first, setFirst] = useState(0);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(12);
  const [totalPage, setTotalPage] = useState(0);

  const cities = [{ name: "Tài liệu", code: "search" }];

  useEffect(() => {
    restClient({
      url: `api/grade/getallgrade?isInclude=false`,
      method: "GET",
    })
      .then((res) => {
        setListGrade(res.data.data || []);
      })
      .catch(() => {
        setListGrade([]);
      });
  }, []);

  useEffect(() => {
    if (params) {
      const classIdParam = params.get("classId") || "";
      const typeParam = params.get("type") || "";
      const decodedText = decodeURIComponent(
        Object.fromEntries(params.entries()).text || ""
      );
      setClassId(classIdParam);
      setTextSearch(decodedText);
      setType(typeParam);
    }
  }, [params]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsFooterVisible(true);
          } else {
            setIsFooterVisible(false);
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (dropDownRef1.current) {
      setFixedDivHeight(dropDownRef1.current.offsetHeight);
    }
    if (dropDownRef2.current) {
      setFixedDivHeight(dropDownRef2.current.offsetHeight);
    }
  }, [dropDownRef1, dropDownRef2]);

  useEffect(() => {
    if (fixedDivRef.current) {
      setFixedDivHeight(fixedDivRef.current.offsetHeight);
    }
  }, [fixedDivRef]);

  const handleSearchClick = () => {
    const encodedText = encodeURIComponent(textSearch.trim());
    setParams({
      ...Object.fromEntries(params.entries()),
      text: encodedText || "",
    });
  };

  //pagination and search
  useEffect(() => {
    console.log("textSearch::",textSearch);
    
    fetchData();
  }, [page, rows, textSearch, classId, type]);

  const fetchData = () => {
    let url = "api/quiz/getallquizpagination?Status=true&";
    const params = new URLSearchParams();

    if (textSearch) {
      params.append("Value", decodeURIComponent(textSearch));
    }

    if (page) {
      params.append("PageIndex", page.toString());
    }

    if (classId) {
      params.append("GradeId", classId);
    }

    if (type && type > 0) {
      params.append("Type", type);
    }

    if (rows) {
      params.append("PageSize", rows.toString());
    }

    url += params.toString();

    setLoading(true);
    restClient({
      url,
      method: "GET",
    })
      .then((res) => {
        const paginationData = JSON.parse(res.headers["x-pagination"]);
        console.log("totalpage::",paginationData.TotalPages);
        
        setTotalPage(paginationData.TotalPages);
        setProducts(Array.isArray(res.data.data) ? res.data.data : []);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setProducts([]);
        setTotalPage(0)
      })
      .finally(() => setLoading(false));
  };

  const onPageChange = (event) => {
    const { page, rows, first } = event;
    setRows(rows);
    setPage(page + 1);
    setFirst(first);
  };

  const handleOnChange = (e) => {
    navigate(`/${e?.value?.code}?text=${textSearch}`);
  };

  const handleGradeChange = (e) => {
    const newClassId = e.target.value;
    setClassId(newClassId);
    setPage(1);
    navigate(
      `?text=${removeVietnameseTones(textSearch)}&classId=${newClassId}${
        type && type > 0 && `&type=${type}`
      }`
    );
  };

  const handleOnChangeType = (e) => {
    const typeNew = e.target.value;
    setType(typeNew);
    setPage(1);
    navigate(
      `?text=${removeVietnameseTones(textSearch)}&type=${typeNew}${
        classId && classId > 0 && `&classId=${classId}`
      }`
    );
  };

  return (
    <NotifyProvider>
      <div className="min-h-screen">
        <div ref={fixedDivRef} className="fixed top-0 w-full z-10">
          <Header
            params={params}
            setParams={setParams}
            textSearchProps={textSearch}
            settextSearchProps={setTextSearch}
          />
          <Menu />
        </div>
        <div
          style={{ paddingTop: `${fixedDivHeight}px` }}
          className="flex gap-5"
        >
          <div className="flex-1 w-[98%] pt-5">
            <div className="m-4 mb-10 flex flex-wrap items-center justify-center gap-2 sm:justify-between">
              <div className="border-2 rounded-md p-2">
                <InputText
                  value={textSearch} // Bind value to local state
                  placeholder="Tìm kiếm"
                  className="flex-1 focus:outline-none w-36 focus:ring-0"
                  onChange={(e) => {
                    setTextSearch(e.target.value);
                    setParams({
                      ...Object.fromEntries(params.entries()),
                      text: encodeURIComponent(e.target.value),
                    });
                  }} // Update textSearch state and params
                />
                <Button
                  icon="pi pi-search"
                  className="p-button-warning focus:outline-none focus:ring-0 flex-shrink-0 cursor-pointer"
                  onClick={handleSearchClick}
                />
              </div>

              {/* <div className="border-2 rounded-md mt-4">
                  <Dropdown
                    filter
                    ref={dropDownRef1}
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.value)}
                    options={cities}
                    optionLabel="name"
                    showClear
                    placeholder="Thể loại"
                    className="w-full md:w-14rem shadow-none h-full"
                  />
                </div> */}
              <div className="flex gap-2 flex-wrap justify-center">
                <div className="border-2 rounded-md my-auto">
                  <Dropdown
                    filter
                    ref={dropDownRef2}
                    value={selectedCity}
                    onChange={handleOnChange}
                    options={cities}
                    optionLabel="name"
                    showClear
                    placeholder="Bộ câu hỏi"
                    className="w-full md:w-14rem shadow-none h-full"
                  />
                </div>
                <div className="border-2 rounded-md p-2">
                  <select
                    name="grade"
                    id="grade"
                    value={classId}
                    onChange={handleGradeChange}
                    className="border border-white outline-none"
                  >
                    <option value={0}>Chọn lớp</option>
                    {listGrade.map((item, index) => (
                      <option value={item.id} key={index}>
                        {item.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="border-2 rounded-md p-2">
                  <select
                    name="type"
                    id="type"
                    value={type}
                    onChange={handleOnChangeType}
                    className="border border-white outline-none"
                  >
                    <option value={0}>Chọn thể loại</option>
                    <option value={1}>Luyện tập</option>
                    <option value={2}>Kiểm tra</option>
                  </select>
                </div>
              </div>
            </div>

            {/* {loading ? (
              <Loading />
            ) : (
              <> */}
            <div className="flex flex-wrap justify-center">
              {products &&
                products?.map((p, index) => {
                  return <CustomQuiz document={p} key={index} />;
                })}
            </div>

            {products && products.length === 0 && (
              <div>
                <h1 className="text-gray-400 font-bold text-4xl text-center mt-20">
                  Bộ câu hỏi không tồn tại
                </h1>
              </div>
            )}

            {Array.isArray(products) && products.length > 0 && (
              <Paginator
                first={first}
                rows={rows}
                totalRecords={totalPage * rows}
                onPageChange={onPageChange}
                rowsPerPageOptions={[12, 20, 30]}
                className="custom-paginator mx-auto"
              />
            )}
            {/* </>
            )} */}
          </div>
        </div>
      </div>
      <Footer ref={footerRef} />
    </NotifyProvider>
  );
}
