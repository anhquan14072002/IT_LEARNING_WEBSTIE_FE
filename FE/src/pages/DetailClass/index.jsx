import React, { useEffect, useRef, useState } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Menu from "../../components/Menu";
import { useNavigate, useParams } from "react-router-dom";
import { getDocumentByGradeId } from "../../services/document.api";
import Loading from "../../components/Loading";
import NotifyProvider from "../../store/NotificationContext";
import CustomCard from "../../components/DocumentCard";
import { Tooltip } from "primereact/tooltip";

export default function DetailClass() {
  const footerRef = useRef(null);
  const fixedDivRef = useRef(null);
  const [fixedDivHeight, setFixedDivHeight] = useState(0);
  const [loading, setLoading] = useState(false);
  const [documentList, setDocumentList] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    getDocumentByGradeId(id, setLoading, setDocumentList);
  }, [id]);

  useEffect(() => {
    if (fixedDivRef.current) {
      setFixedDivHeight(fixedDivRef.current.offsetHeight);
    }
  }, [fixedDivRef.current]);

  // Helper function to extract quizzes by type
  const extractQuizzesByType = (typeId) => {
    const quizzesCustom = (documentList?.quizzesCustom ?? []).filter(
      (q) => q.typeId === typeId
    );

    const quizzesFromDocuments = (documentList?.documents ?? []).flatMap(
      (d) => [
        ...(d.topics ?? []).flatMap((t) => [
          ...(t.quizzes ?? []).filter((q) => q.typeId === typeId),
          ...(t.lessons ?? []).flatMap((l) =>
            (l.quizzes ?? []).filter((q) => q.typeId === typeId)
          ),
        ]),
      ]
    );

    return [...quizzesCustom, ...quizzesFromDocuments];
  };

  const extractProblems = (documentList) => {
    return [
      // Problems from problemsCustom
      ...(documentList?.problemsCustom ?? []),
      // Problems from documents
      ...(documentList?.documents ?? []).flatMap((d) =>
        (d.topics ?? []).flatMap((t) => [
          ...(t.problems ?? []), // Problems directly in topics
          ...(t.lessons ?? []).flatMap((l) => l.problems ?? []), // Problems in lessons within topics
        ])
      ),
    ];
  };

  // Extract quizzes and problems
  const practiceQuizzes = extractQuizzesByType(1);
  const problemExtract = extractProblems(documentList);
  const testQuizzes = extractQuizzesByType(2);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading />
      </div>
    );

  return (
    <NotifyProvider>
      <div className="min-h-screen bg-gray-100">
        <div
          ref={fixedDivRef}
          className="fixed top-0 w-full bg-white shadow-md z-10"
        >
          <Header />
          <Menu />
        </div>
        <main
          style={{ paddingTop: `${fixedDivHeight}px` }}
          className="py-6 px-4"
        >
          <div className="py-6 px-4">
            <div className="text-xl font-bold mb-5">
              {documentList?.title} | Tài liệu, Bài tập, Câu hỏi ôn tập, Đề thi
            </div>
          </div>

          {documentList?.documents?.length > 0 && (
            <section className="mb-14">
              <h2 className="text-2xl font-bold mb-4 text-center text-blue-500">
                Bộ sách
              </h2>
              <div className="flex flex-wrap justify-center">
                {documentList?.documents?.map((item, index) => (
                  <CustomCard key={index} document={item} index={index} />
                ))}
              </div>
              <hr />
            </section>
          )}

          {problemExtract.length > 0 && (
            <Section
              title="Bài tập"
              items={problemExtract}
              navigate={navigate}
              pathPrefix="/codeEditor/"
            />
          )}

          {practiceQuizzes.length > 0 && (
            <Section
              title="Câu hỏi ôn tập flashcard"
              items={practiceQuizzes}
              navigate={navigate}
              pathPrefix="/flashcard/"
              showAllLink="/searchquiz"
            />
          )}

          {testQuizzes.length > 0 && (
            <Section
              title="Câu hỏi ôn tập trắc nghiệm"
              items={testQuizzes}
              navigate={navigate}
              pathPrefix="/testquiz/"
            />
          )}

          {documentList?.exams?.length > 0 && (
            <SectionExam
              title="Đề thi"
              items={documentList.exams}
              navigate={navigate}
            />
          )}
        </main>
      </div>
      <Footer ref={footerRef} />
    </NotifyProvider>
  );
}

// Reusable Section Component
const Section = ({ title, items, navigate, pathPrefix, showAllLink }) => (
  <section className="mb-14">
    <h2 className="text-2xl font-bold mb-4 text-center text-blue-500">
      {title}
    </h2>
    <div className="space-y-2 mt-16">
      <div className="flex flex-wrap justify-center text-center">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`cursor-pointer text-lg transition text-green-600 hover:text-green-400 underline font-semibold w-full sm:w-1/2 mb-10`}
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            onClick={() => navigate(`${pathPrefix}${item.id}`)}
          >
            <Tooltip target={`.tooltipView-${item.id}`} />
            <span
              className={`tooltipView-${item?.id}`}
              data-pr-tooltip={item?.title} // PrimeReact Tooltip attribute
              data-pr-position="top"
            >
              {item?.title}
            </span>
          </div>
        ))}
      </div>
      <hr />
    </div>
  </section>
);

const SectionExam = ({ title, items, navigate }) => {
  const handleNavigateExam = (item) => {
    if (item?.type === 1) {
      navigate(`/examdetail/${item?.id}`);
    } else {
      navigate(`/examcodedetail/${item?.id}`);
    }
  };

  return (
    <section className="mb-14">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-500">
        {title}
      </h2>
      <div className="space-y-2 mt-16">
        <div className="flex flex-wrap justify-center text-center">
          {items.map((item, index) => (
            <div
              key={item.id}
              className={`cursor-pointer text-lg transition text-green-600 hover:text-green-400 underline font-semibold w-full sm:w-1/2 mb-10`}
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              onClick={() => handleNavigateExam(item)}
            >
              <Tooltip target={`.tooltipView-${item.id}`} />
              <span
                className={`tooltipView-${item?.id}`}
                data-pr-tooltip={item?.title}
                data-pr-position="top"
              >
                {item?.title}
              </span>
            </div>
          ))}
        </div>
        <hr />
      </div>
    </section>
  );
};
