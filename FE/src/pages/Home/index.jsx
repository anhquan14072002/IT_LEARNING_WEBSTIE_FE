import React, { useEffect, useRef, useState } from "react";
import Header from "../../components/Header";
import Menu from "../../components/Menu";
import Class from "../../components/Class";
import DocumentCard from "../../components/DocumentCard";
import Footer from "../../components/Footer";
import LazyComponent from "../../components/LazyComponent"; // Import LazyComponent
import LoadingScreen from "../../components/LoadingScreen";
import { getAllGrade } from "../../services/grade.api";
import { getAllDocument } from "../../services/document.api";
import Loading from "../../components/Loading";

export default function Home() {
  const fixedDivRef = useRef(null);
  const [fixedDivHeight, setFixedDivHeight] = useState(0);
  const [loading, setLoading] = useState(true);
  const [classList, setListClass] = useState([]);
  const [documentList, setDocumentList] = useState([]);
  const [loadingGet, setLoadingGet] = useState(false);

  useEffect(() => {
    if (fixedDivRef.current) {
      setFixedDivHeight(fixedDivRef.current.offsetHeight);
    }
  }, [fixedDivRef, loading]);

  useEffect(() => {
    getAllGrade(setLoading, setListClass);
    getAllDocument(setLoadingGet, setDocumentList);
  }, []);

  return (
    <>
      {loading ? (
        <LoadingScreen setLoading={setLoading} />
      ) : (
        <div className="min-h-screen flex flex-col">
          <div ref={fixedDivRef} className="fixed top-0 w-full z-10">
            <Header />
            <Menu />
          </div>

          <div className="px-20" style={{ paddingTop: `${fixedDivHeight}px` }}>
            <h1 className="mt-10 text-2xl font-bold">
              Danh mục bài tập và soạn bài
            </h1>
            <div>
              {classList &&
                classList?.map((item, i) => {
                  return (
                    <LazyComponent key={i}>
                      <Class item={item} index={i} />
                    </LazyComponent>
                  );
                })}
            </div>
          </div>
          <LazyComponent>
            <div className="px-20 mt-16 mb-10">
              <h1 className="mt-10 text-2xl font-bold">
                Tài liệu online cho giáo viên và học sinh
              </h1>
              <div className="my-5 flex justify-between">
                <h1 className="text-gray-500">
                  Dành cho các học sinh từ lớp 1-12
                </h1>
                <h1 className="text-blue-500 cursor-pointer">
                  &gt;&gt; Xem tất cả khóa học
                </h1>
              </div>
              <div className="flex flex-wrap justify-between gap-4 md:gap-3">
                {loadingGet ? (
                  <div className="flex justify-center w-full">
                    <Loading />
                  </div>
                ) : (
                  documentList &&
                  documentList.map((document, index) => (
                    <DocumentCard key={index} document={document}/>
                  ))
                )}
              </div>
            </div>
          </LazyComponent>

          <LazyComponent>
            <Footer />
          </LazyComponent>
        </div>
      )}
    </>
  );
}
