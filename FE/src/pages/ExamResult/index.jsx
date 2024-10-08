import React, { useEffect, useState } from "react";
import restClient from "../../services/restClient";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import NotifyProvider from "../../store/NotificationContext";
import Menu from "../../components/Menu";
import { isLoggedIn } from "../../utils";

const Index = () => {
  const [score, setScore] = useState(null);
  const [historyExam, setHistoryExam] = useState([]);
  const [openResult, setOpenResult] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await restClient({
          url: `api/userexam/getuserexambyid/${id}`,
          method: "GET",
        });
        setScore(response?.data?.data?.score);
        setHistoryExam(response?.data?.data?.historyExam || []);
        console.log(response?.data?.data?.historyExam);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Optionally, set an error state to display an error message
      }
    };

    if (isLoggedIn()) {
      fetchData();
    }
  }, [id]);

  if (!isLoggedIn()) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-xl font-bold mb-4">
          Bạn phải đăng nhập để xem kết quả đề thi đã làm
        </p>
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Đăng nhập
        </button>
      </div>
    );
  }

  return (
    <NotifyProvider>
      <Header />
      <Menu />
      <div className="text-center h-full font-sans bg-white mt-3 ">
        <h1 className="text-3xl text-gray-800 font-bold mb-4">Điểm của bạn</h1>
        <p className="text-3xl mb-6 text-red-600 font-bold">{score}</p>
        {openResult ? (
          <button
            className="bg-blue-600 text-white p-2 text-sm font-normal"
            onClick={() => setOpenResult(false)}
          >
            Xem Chi Tiết Kết Quả
          </button>
        ) : (
          <div>
            <h1 className="text-2xl text-gray-800 mb-4">Chi tiết kết quả</h1>
            <button
              className="bg-blue-600 text-white p-2 text-sm font-normal mb-2"
              onClick={() => setOpenResult(true)}
            >
              Ẩn Kết Quả
            </button>
            <div className="max-h-96 flex justify-center border-black">
              <div
                className="overflow-y-auto"
                style={{ maxHeight: "400px", width: "66.67%" }}
              >
                <table className="w-full bg-white border border-gray-400 ">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b">Câu hỏi số</th>
                      <th className="py-2 px-4 border-b">Đáp án của bạn</th>
                      <th className="py-2 px-4 border-b">Đáp án đúng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyExam.map((item, index) => (
                      <tr key={index} className="bg-gray-100 even:bg-white">
                        <td className="py-2 px-4 border-b">
                          {item?.numberOfQuestion}
                        </td>
                        <td
                          className={`py-2 px-4 border-b ${
                            item?.isCorrect ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {item?.userAnswer || "Chưa trả lời"}
                        </td>
                        <td className="py-2 px-4 border-b text-green-600">
                          {item?.isCorrect
                            ? item?.userAnswer
                            : item?.correctAnswer}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </NotifyProvider>
  );
};

export default Index;
