import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { ACCEPT, decodeBase64, encodeBase64, REJECT } from "../../utils";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/python/python";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import { Editor } from "primereact/editor";
import { useSelector } from "react-redux";
import restClient from "../../services/restClient";
import Loading from "../Loading";

const UpdateSolution = ({
  visible,
  setVisible,
  toast,
  fetchSolutions,
  updateValue,
  id,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const user = useSelector((state) => state.user.value);
  const [loading ,setLoading] = useState(false)

  useEffect(() => {
    if (visible) {
      setTitle(updateValue?.title);
      setDescription(updateValue?.description);
      setCode(decodeBase64(updateValue?.coding));
    }
  }, [updateValue]);

  const handleSubmit = () => {
    
    if (title.trim().length < 5) {
      REJECT(toast, "Vui lòng nhập tiêu đề lớn hơn 5 kí tự");
      return;
    }
    if (title.trim().length > 250) {
      REJECT(toast, "Vui lòng nhập tiêu đề nhỏ hơn 250 kí tự");
      return;
    }
    if (!title.trim() || !description || ( typeof(description) === "string" && !description.trim() ) || !code.trim() ) {
      REJECT(
        toast,
        "Vui lòng không để trống các trường đánh dấu bắt buộc nhập"
      );
      return;
    } 

    setLoading(true)

    restClient({
      url: "api/solution/updatesolution",
      method: "PUT",
      data: {
        id: updateValue?.id,
        title: title.trim(),
        description: description.trim(),
        coding: encodeBase64(code.trim()),
        problemId: id,
        userId: user?.sub,
        isActive: true,
      },
    })
      .then((res) => {
        ACCEPT(toast, "Cập nhật thành công!!!");
        fetchSolutions();
      })
      .catch((err) => {
        REJECT(toast, "Cập nhật không thành công!!!");
      })
      .finally(() => {
        setVisible(false);
        setTitle("");
        setDescription("");
        setCode("");
        setLoading(false);
      });
  };

  return (
    <Dialog
      header="Cập nhật bình luận"
      visible={visible}
      style={{ width: "50vw" }}
      onHide={() => {
        setVisible(false);
      }}
    >
      {loading ? (<Loading />) : (
        <>
        <div className="mb-5">
        <h1>
          Tiêu đề<span className="text-red-500">*</span>
        </h1>
        <input
          type="text"
          className="w-full p-2 border border-gray-400 rounded-lg"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <h1>
          Mô tả<span className="text-red-500">*</span>
        </h1>
        <Editor
          style={{ height: "300px" }}
          className="mb-5 border"
          value={description}
          onTextChange={(e) => setDescription(e.htmlValue)}
        />
      </div>

      <div className="mb-5">
        <h1>
          Lời giải <span className="text-red-500">*</span>
        </h1>
        <CodeMirror
          value={code}
          options={{
            theme: "material",
            lineNumbers: true,
          }}
          onBeforeChange={(editor, data, value) => {
            setCode(value);
          }}
          editorDidMount={(editor) => {
            editor.setSize(null, "calc(50vh - 5px)");
          }}
        />
      </div>

      <div className="flex justify-end gap-5">
        <Button
          className="p-2 bg-red-500 text-white"
          type="button"
          severity="danger"
          onClick={() => {
            setVisible(false);
            setTitle("");
            setDescription("");
            setCode("");
          }}
        >
          Hủy
        </Button>
        <Button
          className="p-2 bg-blue-500 text-white"
          type="submit"
          onClick={handleSubmit}
        >
          Cập nhật
        </Button>
      </div>
        </>
      )}
    </Dialog>
  );
};

export default UpdateSolution;
