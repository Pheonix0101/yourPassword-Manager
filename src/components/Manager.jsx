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
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: "",
    color: "gray",
  });
  // Password generator state
  const [showGenerator, setShowGenerator] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [isGeneratorClicked, setIsGeneratorClicked] = useState(false);
  const [passwordOptions, setPasswordOptions] = useState({
    length: 12,
    includeLowercase: true,
    includeUppercase: true,
    includeNumbers: true,
    includeSymbols: true,
  });

  const passRef = useRef();
  const passwordRef = useRef();
  const generatorRef = useRef(null);

  // Check if generator can be shown
  const canShowGenerator = form.site.length > 3 && form.username.length > 3 && (passwordFocused || showGenerator);

  const getPassword = async () => {
    let req = await fetch("http://localhost:3000/");
    let passwords = await req.json();

    console.log(passwords);
    setpassArray(passwords);
  };

  useEffect(() => {
    getPassword();
  }, []);

  // Function to check password strength
  const checkPasswordStrength = (password) => {
    let score = 0;
    let message = "";
    let color = "gray";

    if (!password) {
      setPasswordStrength({ score: 0, message: "", color: "gray" });
      return;
    }

    // Check length
    if (password.length >= 8) {
      score += 1;
    }
    if (password.length >= 12) {
      score += 1;
    }

    // Check for mixed case
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) {
      score += 1;
    }

    // Check for numbers
    if (password.match(/\d/)) {
      score += 1;
    }

    // Check for special characters
    if (password.match(/[^a-zA-Z0-9]/)) {
      score += 1;
    }

    // Determine message and color based on score
    if (score === 0) {
      message = "Too weak";
      color = "#ef4444"; // red-500
    } else if (score === 1) {
      message = "Weak";
      color = "#f97316"; // orange-500
    } else if (score === 2) {
      message = "Fair";
      color = "#eab308"; // yellow-500
    } else if (score === 3) {
      message = "Good";
      color = "#84cc16"; // lime-500
    } else if (score === 4) {
      message = "Strong";
      color = "#22c55e"; // green-500
    } else {
      message = "Very Strong";
      color = "#15803d"; // green-700
    }

    setPasswordStrength({ score, message, color });
  };

  // Add click outside handler to handle generator panel clicks
  useEffect(() => {
    function handleClickOutside(event) {
      if (generatorRef.current && !generatorRef.current.contains(event.target) && 
          !passwordRef.current.contains(event.target)) {
        setPasswordFocused(false);
        if (!isGeneratorClicked) {
          setShowGenerator(false);
        }
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isGeneratorClicked]);

  // Password Generator Function
  const generatePassword = () => {
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+~`|}{[]:;?><,./-=";
    
    let chars = "";
    if (passwordOptions.includeLowercase) chars += lowercase;
    if (passwordOptions.includeUppercase) chars += uppercase;
    if (passwordOptions.includeNumbers) chars += numbers;
    if (passwordOptions.includeSymbols) chars += symbols;
    
    // If no character types selected, use lowercase as default
    if (chars === "") chars = lowercase;
    
    let password = "";
    for (let i = 0; i < passwordOptions.length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }
    
    setform({ ...form, password });
    toast("✨ Password generated!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  // Handle password option changes
  const handlePasswordOptionChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPasswordOptions({
      ...passwordOptions,
      [name]: type === "checkbox" ? checked : parseInt(value),
    });
  };

  // Check password strength when password changes
  useEffect(() => {
    checkPasswordStrength(form.password);
  }, [form.password]);

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

  const savePassword = async () => {
    if (
      form.site.length > 3 &&
      form.username.length > 3 &&
      form.password.length > 5
    ) {
      setpassArray([...passArray, { ...form, id: uuidv4() }]);

      // if such id exist in db then delete it before saving---- for edit mode.

      await fetch("http://localhost:3000/delete", {
        method: "DELETE",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify({ id: form.id }),
      });

      await fetch("http://localhost:3000/save", {
        method: "POST",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify({ ...form, id: uuidv4() }),
      });
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

  const deletePassword = async (id) => {
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

      await fetch("http://localhost:3000/delete", {
        method: "DELETE",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
    }
  };

  const HandleEdit = (id) => {
    setform({...passArray.filter((item) => item.id === id)[0],id:id});
    setpassArray(passArray.filter((item) => item.id !== id));
    console.log("editing id with password", passArray);
    // localStorage.setItem("password", JSON.stringify(passArray.filter((item)=> item.id !== id)));
  };

  const handleChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  const handleGeneratorToggle = () => {
    setShowGenerator(!showGenerator);
    setIsGeneratorClicked(true);
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
           
          {/* Fixed layout with explicit sizing to prevent field size changes */}
          <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-10">
            <div>
              <input
                className="border border-green-500 focus:border-gray-300 rounded-full w-full text-black p-4 py-1"
                type="text"
                name="username"
                placeholder="Enter Username"
                id="username"
                value={form.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <div className="relative">
                <input
                  className="border border-green-500 focus:border-gray-300 rounded-full w-full text-black p-4 py-1"
                  type="password"
                  ref={passwordRef}
                  name="password"
                  placeholder="Enter Password"
                  id="password"
                  value={form.password}
                  onChange={handleChange}
                  onFocus={() => {
                    setPasswordFocused(true);
                    setIsGeneratorClicked(false);
                  }}
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
              {form.password && (
                <div className="mt-1 text-sm">
                  <div className="flex items-center">
                    <div className="flex-1 flex h-3 bg-gray-200 rounded-full overflow-hidden gap-1 p-0.5">
                      {[1, 2, 3, 4, 5].map((segment) => (
                        <div
                          key={segment}
                          className="h-full flex-1 rounded-full transition-all duration-300 ease-in-out"
                          style={{
                            backgroundColor: 
                              passwordStrength.score >= segment 
                                ? passwordStrength.color 
                                : 'transparent',
                            opacity: passwordStrength.score >= segment ? 1 : 0.2
                          }}
                        ></div>
                      ))}
                    </div>
                    <span className="ml-3 font-medium" style={{ color: passwordStrength.color }}>
                      {passwordStrength.message}
                    </span>
                  </div>
                  {passwordStrength.score < 3 && (
                    <p className="text-xs text-gray-700 mt-2 bg-yellow-50 p-2 rounded-md border-l-2 border-yellow-400">
                      <span className="font-medium">Tip:</span> Use a mix of uppercase & lowercase letters, numbers, and special characters (!@#$%^&*) for a stronger password.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Password Generator Button - Only shown when conditions are met */}
          {canShowGenerator && (
            <button
              onClick={handleGeneratorToggle}
              className="flex justify-center items-center gap-2 bg-blue-400 w-fit px-5 py-1.5 hover:bg-blue-300 rounded-full border border-blue-900"
            >
              {showGenerator ? "Hide Password Generator" : "Generate Password"}
            </button>
          )}

          {/* Password Generator Panel */}
          {showGenerator && canShowGenerator && (
            <div 
              ref={generatorRef}
              className="w-full bg-gray-50 p-4 rounded-lg border border-green-200 shadow-sm"
              onMouseDown={() => setIsGeneratorClicked(true)}
            >
              <h3 className="font-medium text-lg mb-3">Password Generator</h3>
              
              <div className="mb-3">
                <label className="block mb-1 text-sm">Password Length: {passwordOptions.length}</label>
                <input 
                  type="range" 
                  min="6" 
                  max="30" 
                  name="length"
                  value={passwordOptions.length} 
                  onChange={handlePasswordOptionChange}
                  className="w-full accent-green-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="includeLowercase" 
                    name="includeLowercase"
                    checked={passwordOptions.includeLowercase} 
                    onChange={handlePasswordOptionChange}
                    className="mr-2 accent-green-500"
                  />
                  <label htmlFor="includeLowercase" className="text-sm">Lowercase (a-z)</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="includeUppercase" 
                    name="includeUppercase"
                    checked={passwordOptions.includeUppercase} 
                    onChange={handlePasswordOptionChange}
                    className="mr-2 accent-green-500"
                  />
                  <label htmlFor="includeUppercase" className="text-sm">Uppercase (A-Z)</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="includeNumbers" 
                    name="includeNumbers"
                    checked={passwordOptions.includeNumbers} 
                    onChange={handlePasswordOptionChange}
                    className="mr-2 accent-green-500"
                  />
                  <label htmlFor="includeNumbers" className="text-sm">Numbers (0-9)</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="includeSymbols" 
                    name="includeSymbols"
                    checked={passwordOptions.includeSymbols} 
                    onChange={handlePasswordOptionChange}
                    className="mr-2 accent-green-500"
                  />
                  <label htmlFor="includeSymbols" className="text-sm">Symbols (!@#$%^&*)</label>
                </div>
              </div>
              
              <button
                onClick={generatePassword}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded transition-colors"
              >
                Generate
              </button>
            </div>
          )}

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
                          <span>{"*".repeat((item.password).length)}</span>
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
