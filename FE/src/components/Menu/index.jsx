import React, { useEffect, useState } from "react";
import Loading from "../Loading";
import restClient from "../../services/restClient";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Menu() {
  const [listClast, setListClass] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("location::", location.pathname);

    setLoading(true);
    restClient({
      url: `api/grade/getallgrade?isInclude=false`,
      method: "GET",
    })
      .then((res) => {
        setListClass(res.data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        setListClass([]);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <div className="justify-around border-b-2 z-10 bg-white hidden menuBar:flex">
        {loading ? (
          <Loading heightValue={"70px"} />
        ) : (
          <>
            <div
              className={`p-2 cursor-pointer ${
                location.pathname === "/" && "bg-[#D1F7FF]"
              }  hover:bg-[#D1F7FF] flex-1 flex justify-center`}
              onClick={() => navigate("/")}
            >
              <svg
                viewBox="0 0 576 512"
                xmlns="http://www.w3.org/2000/svg"
                width={30}
                height={30}
              >
                <path d="M280.4 148.3L96 300.1V464a16 16 0 0 0 16 16l112.1-.3a16 16 0 0 0 15.9-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.6a16 16 0 0 0 16 16.1L464 480a16 16 0 0 0 16-16V300L295.7 148.3a12.2 12.2 0 0 0 -15.3 0zM571.6 251.5L488 182.6V44.1a12 12 0 0 0 -12-12h-56a12 12 0 0 0 -12 12v72.6L318.5 43a48 48 0 0 0 -61 0L4.3 251.5a12 12 0 0 0 -1.6 16.9l25.5 31A12 12 0 0 0 45.2 301l235.2-193.7a12.2 12.2 0 0 1 15.3 0L530.9 301a12 12 0 0 0 16.9-1.6l25.5-31a12 12 0 0 0 -1.7-16.9z" />
              </svg>
            </div>
            {listClast &&
              listClast.map((clast, index) => (
                <div
                  className={`p-2 flex items-center justify-center cursor-pointer hover:bg-[#D1F7FF] flex-1 ${
                    location.pathname === `/detailclass/${clast?.id}` &&
                    "bg-[#D1F7FF]"
                  }`}
                  key={index}
                  onClick={() => navigate("/detailclass/" + clast?.id)}
                >
                  {clast?.title}
                </div>
              ))}

            <div
              onClick={() => navigate("/post/0")}
              className={`p-2 flex items-center justify-center cursor-pointer hover:bg-[#D1F7FF] flex-1
              ${location.pathname === `/post/0` && "bg-[#D1F7FF]"}`}
            >
              Hỏi bài
            </div>
            <div
              className={`p-2 flex items-center justify-center cursor-pointer hover:bg-[#D1F7FF] flex-1
              ${location.pathname === `/listpractice` && "bg-[#D1F7FF]"}`}
              onClick={() => navigate("/listpractice")}
            >
              Thực hành
            </div>
            <div
              className={`p-2 flex items-center justify-center cursor-pointer hover:bg-[#D1F7FF] flex-1
              ${location.pathname === `/viewexam` && "bg-[#D1F7FF]"}`}
              onClick={(e) => navigate("/viewexam")}
            >
              Đề Thi
            </div>
          </>
        )}
      </div>

      <div className="border-b-2 block menuBar:hidden">
        {loading ? (
          <Loading heightValue={"70px"} />
        ) : (
          <div className="py-2 z-50 bg-white">
            <div className=" px-2 cursor-pointer pb-2">
              <span
                className="pi pi-bars"
                onClick={() => setIsOpen(!isOpen)}
              ></span>
            </div>
            {isOpen && (
              <div className="">
                <div
                  className={`p-2 cursor-pointer ${
                    location.pathname === "/" && "bg-[#D1F7FF]"
                  }  hover:bg-[#D1F7FF] flex-1 flex justify-center`}
                  onClick={() => navigate("/")}
                >
                  <svg
                    viewBox="0 0 576 512"
                    xmlns="http://www.w3.org/2000/svg"
                    width={30}
                    height={30}
                  >
                    <path d="M280.4 148.3L96 300.1V464a16 16 0 0 0 16 16l112.1-.3a16 16 0 0 0 15.9-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.6a16 16 0 0 0 16 16.1L464 480a16 16 0 0 0 16-16V300L295.7 148.3a12.2 12.2 0 0 0 -15.3 0zM571.6 251.5L488 182.6V44.1a12 12 0 0 0 -12-12h-56a12 12 0 0 0 -12 12v72.6L318.5 43a48 48 0 0 0 -61 0L4.3 251.5a12 12 0 0 0 -1.6 16.9l25.5 31A12 12 0 0 0 45.2 301l235.2-193.7a12.2 12.2 0 0 1 15.3 0L530.9 301a12 12 0 0 0 16.9-1.6l25.5-31a12 12 0 0 0 -1.7-16.9z" />
                  </svg>
                </div>
                {listClast &&
                  listClast.map((clast, index) => (
                    <div
                      className={`p-2 flex items-center justify-center cursor-pointer hover:bg-[#D1F7FF] flex-1 ${
                        location.pathname === `/detailclass/${clast?.id}` &&
                        "bg-[#D1F7FF]"
                      }`}
                      key={index}
                      onClick={() => navigate("/detailclass/" + clast?.id)}
                    >
                      {clast?.title}
                    </div>
                  ))}

                <div
                  onClick={() => navigate("/post/0")}
                  className={`p-2 flex items-center justify-center cursor-pointer hover:bg-[#D1F7FF] flex-1
                ${location.pathname === `/post/0` && "bg-[#D1F7FF]"}`}
                >
                  Hỏi bài
                </div>
                <div
                  className={`p-2 flex items-center justify-center cursor-pointer hover:bg-[#D1F7FF] flex-1
                ${location.pathname === `/listpractice` && "bg-[#D1F7FF]"}`}
                  onClick={() => navigate("/listpractice")}
                >
                  Thực hành
                </div>
                <div
                  className={`p-2 flex items-center justify-center cursor-pointer hover:bg-[#D1F7FF] flex-1
                ${location.pathname === `/viewexam` && "bg-[#D1F7FF]"}`}
                  onClick={(e) => navigate("/viewexam")}
                >
                  Đề Thi
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default Menu;
