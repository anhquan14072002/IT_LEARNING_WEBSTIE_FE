import React from "react";

function Menu() {
  return (
    <div className="flex justify-around border-b-2 z-10 bg-white">
      <div className="p-2 cursor-pointer bg-[#D1F7FF] hover:bg-[#D1F7FF] flex-1 flex justify-center">
        <svg
          viewBox="0 0 576 512"
          xmlns="http://www.w3.org/2000/svg"
          width={30}
          height={30}
        >
          <path d="M280.4 148.3L96 300.1V464a16 16 0 0 0 16 16l112.1-.3a16 16 0 0 0 15.9-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.6a16 16 0 0 0 16 16.1L464 480a16 16 0 0 0 16-16V300L295.7 148.3a12.2 12.2 0 0 0 -15.3 0zM571.6 251.5L488 182.6V44.1a12 12 0 0 0 -12-12h-56a12 12 0 0 0 -12 12v72.6L318.5 43a48 48 0 0 0 -61 0L4.3 251.5a12 12 0 0 0 -1.6 16.9l25.5 31A12 12 0 0 0 45.2 301l235.2-193.7a12.2 12.2 0 0 1 15.3 0L530.9 301a12 12 0 0 0 16.9-1.6l25.5-31a12 12 0 0 0 -1.7-16.9z" />
        </svg>
      </div>
      {Array.from({ length: 10 }, (_, i) => (
        <div
          className="p-2 flex items-center justify-center cursor-pointer hover:bg-[#D1F7FF] flex-1"
          key={i + 3}
        >
          Lớp {i + 3}
        </div>
      ))}
      <div className="p-2 flex items-center justify-center cursor-pointer hover:bg-[#D1F7FF] flex-1">
        Hỏi bài
      </div>
      <div className="p-2 flex items-center justify-center cursor-pointer hover:bg-[#D1F7FF] flex-1">
        Thực hành
      </div>
    </div>
  );
}

export default Menu;