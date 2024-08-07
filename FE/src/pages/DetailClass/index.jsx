import React, { useEffect, useRef, useState } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Menu from "../../components/Menu";
import { useNavigate, useParams } from "react-router-dom";
import { getDocumentByGradeId } from "../../services/document.api";
import Loading from "../../components/Loading";

export default function DetailClass() {
  const footerRef = useRef(null);
  const fixedDivRef = useRef(null);
  const [fixedDivHeight, setFixedDivHeight] = useState(0);
  const [loading, setLoading] = useState(false);
  const [documentList, setDocumentList] = useState([]);
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
  const extractQuizzesByType = (type) => {
    return (documentList?.documents ?? []).flatMap((d) =>
      (d.topics ?? []).flatMap((t) =>
        [
          ...(t.quizzes ?? []).filter((q) => q.type === type),
          ...(t.lessons ?? []).flatMap((l) => (l.quizzes ?? []).filter((q) => q.type === type)),
        ]
      )
    );
  };

  // Extract quizzes
  const practiceQuizzes = extractQuizzesByType(documentList, "Practice");
  const testQuizzes = extractQuizzesByType(documentList, "Test");

  if (loading) return <Loading />;

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <div ref={fixedDivRef} className="fixed top-0 w-full bg-white shadow-md z-10">
          <Header />
          <Menu />
        </div>
        <main style={{ paddingTop: `${fixedDivHeight}px` }} className="py-6 px-4">
        <div className="py-6 px-4">
        <div className="text-xl font-bold mb-5">
      {documentList?.title} | Đề thi, Bài tập, Tài liệu, Câu hỏi ôn tập
    </div>
  <ul className="list-disc pl-5 space-y-2">
    
    <li className="text-md text-blue-500 underline cursor-pointer font-bold">
      Tài liệu {documentList?.title}
    </li>
    <li className="text-md text-blue-500 underline cursor-pointer font-bold">
      Câu hỏi ôn tập flashcard {documentList?.title}
    </li>
    <li className="text-md text-blue-500 underline cursor-pointer font-bold">
      Câu hỏi ôn tập trắc nghiệm {documentList?.title}
    </li>
    <li className="text-md text-blue-500 underline cursor-pointer font-bold">
      Đề thi {documentList?.title}
    </li>
    <li className="text-md text-blue-500 underline cursor-pointer font-bold">
      Bài tập {documentList?.title}
    </li>
  </ul>
</div>


          {documentList?.documents?.length > 0 && (
            <Section
              title="Các bộ sách"
              items={documentList.documents}
              navigate={navigate}
              pathPrefix="/document/"
              showAllLink={`/search?classId=${id}`}
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
              showAllLink="/searchquiz"
            />
          )}

          {documentList?.exams?.length > 0 && (
            <Section
              title="Đề thi"
              items={documentList.exams}
              navigate={navigate}
              pathPrefix="/document/"
              showAllLink={`/search?classId=${id}`}
            />
          )}

          {documentList?.documents?.flatMap(d =>
            d.topics?.flatMap(t =>
              t.lessons?.flatMap(l => l.problems) || []
            ) || []
          ).length > 0 && (
            <Section
              title="Bài tập"
              items={documentList.documents.flatMap(d =>
                d.topics?.flatMap(t =>
                  t.lessons?.flatMap(l => l.problems) || []
                ) || []
              )}
              navigate={navigate}
              pathPrefix="/codeEditor/"
            />
          )}
        </main>
      </div>
      <Footer ref={footerRef} />
    </>
  );
}

// Reusable Section Component
const Section = ({ title, items, navigate, pathPrefix, showAllLink }) => (
  <section className="mb-14">
    <h2 className="text-2xl font-bold mb-4 text-center text-blue-500">{title}</h2>
    <div className="space-y-2">
    <div className="grid grid-cols-2 gap-4 text-center">
        {items.map(item => (
          <div
            key={item.id}
            className="cursor-pointer text-lg transition text-green-600 font-semibold"
            onClick={() => navigate(`${pathPrefix}${item.id}`)}
          >
            {item.title}
          </div>
        ))}
      </div>
      {items.length > 4 && (
        <div className="grid grid-cols-2 gap-4 text-center">
          <p></p>
        <p
          href={showAllLink}
          className="text-sm text-blue-600 underline mt-3 text-center"
        >
          {">>> "}Xem tất cả
        </p>
        </div>
      )}
      <hr />
    </div>
  </section>
);
