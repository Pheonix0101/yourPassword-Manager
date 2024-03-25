import { useEffect, useRef, useState } from "react";
import { IoEye } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from "uuid";

import "../App.css";

function Manager() {
  const [showPassword, setshowPassword] = useState(false);
  const [form, setform] = useState({ site: "", username: "", password: "" });
  const [passArray, setpassArray] = useState([]);

  const passRef = useRef();
  const passwordRef = useRef();

  useEffect(() => {
    let passwords = localStorage.getItem("password");
    if (passwords) {
      setpassArray(JSON.parse(passwords));
    }
  }, []);

  const handleCopytext = (text) => {
    toast("😀 Copy to clipboard!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      // transition: Bounce,
    });
    navigator.clipboard.writeText(text);
  };

  const handlePassword = () => {
    setshowPassword((pass) => !pass);
    const passwordInput = passwordRef.current;
    if (passwordInput) {
      passwordInput.type = showPassword ? "password" : "text";
    }
  };

  const savePassword = () => {
    if (
      form.site.length > 3 &&
      form.username.length > 3 &&
      form.password.length > 5
    ) {
      setpassArray([...passArray, { ...form, id: uuidv4() }]);
      localStorage.setItem(
        "password",
        JSON.stringify([...passArray, { ...form, id: uuidv4() }])
      );
      setform({ site: "", username: "", password: "" });
      toast("😀 Password saved!!!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        // transition: Bounce,
      });
    } else {
      toast("Error: Password not saved!!!");
    }
  };

  const deletePassword = (id) => {
    toast("😀 Password deleted", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      // transition: Bounce,
    });
    console.log(" deleting id with password", id);
    let conf = confirm("Are you sure you want to delete");
    if (conf) {
      setpassArray(passArray.filter((item) => item.id !== id));
      localStorage.setItem(
        "password",
        JSON.stringify(passArray.filter((item) => item.id !== id))
      );
    }
  };

  const HandleEdit = (id) => {
    setform(passArray.filter((item) => item.id === id)[0]);
    setpassArray(passArray.filter((item) => item.id !== id));
    console.log("editing id with password", passArray);
    // localStorage.setItem("password", JSON.stringify(passArray.filter((item)=> item.id !== id)));
  };

  const handleChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        // transition: Bounce,
      />
      {/* Same as */}
      <ToastContainer />
      <div className="absolute inset-0 -z-10 h-full w-full bg-green-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-green-400 opacity-20 blur-[100px]"></div>
      </div>
      <div className="p-1 md:p-0 md:mycontainer min-h-[85.08vh]">
        <h1 className="text-2xl font-bold text-center">
          <span className="text-green-500">&lt;</span>
          Pass
          <span className="text-green-500">OP/&gt;</span>
        </h1>
        <p className="text-green-900 text-center">Your Own Password Manager</p>
        <div className="flex  flex-col p-4 text-black gap-6 items-center">
          <input
            className="border border-green-500 focus:border-gray-300 rounded-full w-full text-black p-4 py-1"
            type="text"
            name="site"
            placeholder="Enter website URL"
            id="site"
            value={form.site}
            onChange={handleChange}
          />
          <div className="flex flex-col md:flex-row w-full justify-between gap-10">
            <input
              className="border border-green-500 focus:border-gray-300  rounded-full w-full text-black p-4 py-1"
              type="text"
              name="username"
              placeholder="Enter Username"
              id="username"
              value={form.username}
              onChange={handleChange}
            />
            <div className="relative">
              <input
                className="border border-green-500  focus:border-gray-300 rounded-full w-full text-black p-4 py-1"
                type="password"
                ref={passwordRef}
                name="password"
                placeholder="Enter Password"
                id="password"
                value={form.password}
                onChange={handleChange}
              />
              <span
                ref={passRef}
                className="absolute right-1 top-2 cursor-pointer"
                onClick={handlePassword}
              >
                {showPassword ? (
                  <IoMdEyeOff style={{ fontSize: "17px" }} />
                ) : (
                  <IoEye style={{ fontSize: "17px" }} />
                )}
              </span>
            </div>
          </div>
          <button
            onClick={savePassword}
            className="flex justify-center items-center gap-2 bg-green-400 w-fit px-5 py-1.5 hover:bg-green-300 rounded-full border border-green-900"
          >
            <lord-icon
              src="https://cdn.lordicon.com/jgnvfzqg.json"
              trigger="hover"
              // style="width:250px;height:250px"
            ></lord-icon>
            Save Password
          </button>
        </div>
        <h2 className="font-bold text-xl font-sans py-4">Your Passwords</h2>
        <div className="passwords">
          {passArray.length === 0 && <div>No Passwords to show</div>}
          {passArray.length !== 0 && (
            <table className="table-auto w-full rounded-md overflow-hidden mb-7">
              <thead className="text-white bg-green-800">
                <tr>
                  <th className="py-1">website URL</th>
                  <th className="py-1">Username</th>
                  <th className="py-1">Password</th>
                  <th className="py-1">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-green-100">
                {passArray.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td className=" border border-white text-center py-2 w-auto">
                        <div className="flex items-center justify-center">
                          <a href={item.site} target="_blank">
                            {item.site}
                          </a>
                          <div
                            className="lordiconCopy cursor-pointer mx-1 size-7"
                            onClick={() => handleCopytext(item.site)}
                          >
                            <img
                              className=""
                              style={{
                                height: "22px",
                                width: "25px",
                                paddingTop: "1px",
                              }}
                              src="/copy.png"
                              alt="site"
                            />
                          </div>
                        </div>
                      </td>
                      <td className=" border border-white text-center py-2 ">
                        <div className="flex items-center justify-center">
                          <span> {item.username}</span>
                          <div
                            className="lordiconCopy size-7 cursor-pointer"
                            onClick={() => handleCopytext(item.username)}
                          >
                            <img
                              className="  inline items-center"
                              style={{
                                height: "20px",
                                width: "25px",
                                paddingTop: "1px",
                              }}
                              src="/copy.png"
                              alt="username"
                            />
                          </div>
                        </div>
                      </td>
                      <td className=" border border-white text-center py-2 ">
                        <div className="flex items-center justify-center">
                          <span>{item.password}</span>
                          <div
                            className="lordiconCopy cursor-pointer mx-1 size-7"
                            onClick={() => handleCopytext(item.password)}
                          >
                            <img
                              className=" cursor-pointer inline items-center mx-1"
                              style={{
                                height: "20px",
                                width: "25px",
                                paddingTop: "1px",
                              }}
                              src="/copy.png"
                              alt="password"
                            />
                          </div>
                        </div>
                      </td>
                      <td className="border border-white text-center py-2">
                        <div className="flex justify-center items-center">
                          <span onClick={() => HandleEdit(item.id)}>
                            <img
                              src="/edit.png"
                              alt="edit"
                              style={{
                                height: "25px",
                                width: "25px",
                                paddingTop: "1px",
                                cursor: "pointer",
                                marginLeft: "4px",
                              }}
                            />
                          </span>
                          <span onClick={() => deletePassword(item.id)}>
                            <img
                              src="/delete.png"
                              alt="delete"
                              style={{
                                height: "25px",
                                width: "25px",
                                paddingTop: "1px",
                                cursor: "pointer",
                                marginLeft: "4px",
                              }}
                            />
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

export default Manager;
