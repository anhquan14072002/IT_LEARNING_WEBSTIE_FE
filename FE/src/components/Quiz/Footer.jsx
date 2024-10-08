import { Button } from "primereact/button";
import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import help from "../../assets/img/icons8-help-30.png";
import arrows from "../../assets/img/arrows.png";
import continueImg from "../../assets/img/continue.png";
import back from "../../assets/img/icons8-back-50.png";
import cancel from "../../assets/img/icons8-cancel-24.png";
import correct from "../../assets/img/correct.png";
import FormDataContext from "../../store/FormDataContext";
function IconButton({ icon, title, active, ...props }) {
  let cssButton = "border border-[#c5c7c7] py-1 px-3 mt-1";
  if (active) {
    cssButton += " bg-blue-500";
  }
  return (
    <Button className={cssButton} {...props}>
      <img src={icon} width="25" height="25" className="mr-1" />
      {title}
    </Button>
  );
}
function Footer({ Menus, id }) {
  const location = useLocation();
  const navigate = useNavigate();

  const locationSplit = location.pathname.split("/")[2];
  const indexRoute = Menus.findIndex((menu) =>
    menu.path.includes(locationSplit)
  );
  const { success, step } = useContext(FormDataContext);
  function implement() {
    const nextRoute = Menus[indexRoute + 1].path;
    navigate(nextRoute);
  }
  function backRoute() {
    /* solution: Where is the origin of action from ? 
          -  w*/
    let nextRoute =
      indexRoute === 0
        ? `/dashboard/quiz/managequestionofquizlist/${id}`
        : Menus[indexRoute - 1].path;
    navigate(nextRoute);
  }
  let labelButton = "Tiếp Tục";
  let imgButton = continueImg;
  if (step === `stepTwo/${id}`) {
    labelButton = "Thực Hiện";
    imgButton = arrows;
  }

  return (
    <footer className="flex justify-between  mt-2">
      <Button
        className="border border-[#c5c7c7] py-1 px-3"
        tooltip="1. Tải mẫu excel để nhập khẩu 'Tại file mẫu excel'
          2. Ấn nút 'Upload File' và upload tài liệu muốn nhập khẩu
          3. Ấn nút Tiếp tục dưới màn hình 
          4. Kiểm tra những dữ liệu muốn nhập khẩu vào hệ thống
          5. Ấn nút Thực hiện dưới màn hình để Nhập khẩu vào hệ thống
          6. Ấn nút Hủy bỏ để Thoát"
        tooltipOptions={{ position: "top" }}
      >
        <img src={help} width="25" height="25" className="mr-1" />
        Giúp
      </Button>
      <span className="flex gap-4">
        {indexRoute != 2 && (
          <IconButton icon={back} title="Quay lại" onClick={backRoute} />
        )}
        {indexRoute != 2 && (
          <IconButton
            icon={imgButton}
            title={labelButton}
            onClick={implement}
            disabled={success == 0 && step == `stepTwo/${id}`}
          />
        )}
        {location.pathname === `/importQuiz/stepThree/${id}` ? (
          <div>
            <IconButton
              icon={correct}
              title="Trở về trang danh sách câu hỏi"
              onClick={() =>
                navigate("/dashboard/quiz/managequestionofquizlist/" + id)
              }
            />
          </div>
        ) : (
          <IconButton
            icon={cancel}
            title="Hủy bỏ"
            onClick={() =>
              navigate("/dashboard/quiz/managequestionofquizlist/" + id)
            }
          />
        )}
      </span>
    </footer>
  );
}

export default Footer;
