import { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from "uuid";

import "../App.css";
import PasswordForm from "./PasswordForm";
import PasswordGenerator from "./PasswordGenerator";
import PasswordList from "./PasswordList";
import { checkPasswordStrength } from "./PasswordUtils";
import * as ApiService from "./ApiService";

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
    try {
      const passwords = await ApiService.fetchPasswords();
      setpassArray(passwords);
    } catch (error) {
      console.error("Failed to fetch passwords:", error);
    }
  };

  useEffect(() => {
    getPassword();
  }, []);

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

  // Check password strength when password changes
  useEffect(() => {
    setPasswordStrength(checkPasswordStrength(form.password));
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
      const newPassword = { ...form, id: uuidv4() };
      setpassArray([...passArray, newPassword]);

      // if such id exist in db then delete it before saving---- for edit mode.
      if (form.id) {
        try {
          await ApiService.deletePassword(form.id);
        } catch (error) {
          console.error("Failed to delete previous password:", error);
        }
      }

      try {
        await ApiService.savePassword(newPassword);
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
        });
      } catch (error) {
        console.error("Failed to save password:", error);
        toast("Error: Failed to save password!");
      }
    } else {
      toast("Error: Password not saved!!!");
    }
  };

  const deletePasswordHandler = async (id) => {
    toast("😀 Password deleted", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    console.log(" deleting id with password", id);
    let conf = confirm("Are you sure you want to delete");
    if (conf) {
      setpassArray(passArray.filter((item) => item.id !== id));

      try {
        await ApiService.deletePassword(id);
      } catch (error) {
        console.error("Failed to delete password:", error);
      }
    }
  };

  const handleEdit = (id) => {
    setform({...passArray.filter((item) => item.id === id)[0], id:id});
    setpassArray(passArray.filter((item) => item.id !== id));
    console.log("editing id with password", passArray);
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
      />
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
        
        {/* Password Form Component */}
        <PasswordForm 
          form={form}
          handleChange={handleChange}
          passwordRef={passwordRef}
          passRef={passRef}
          showPassword={showPassword}
          handlePassword={handlePassword}
          passwordStrength={passwordStrength}
          setPasswordFocused={setPasswordFocused}
          setIsGeneratorClicked={setIsGeneratorClicked}
        />
        
        {/* Password Generator Component */}
        <div className="flex flex-col items-center">
          <PasswordGenerator 
            showGenerator={showGenerator}
            handleGeneratorToggle={handleGeneratorToggle}
            canShowGenerator={canShowGenerator}
            generatorRef={generatorRef}
            setIsGeneratorClicked={setIsGeneratorClicked}
            passwordOptions={passwordOptions}
            handlePasswordOptionChange={(e) => {
              const { name, value, type, checked } = e.target;
              setPasswordOptions({
                ...passwordOptions,
                [name]: type === "checkbox" ? checked : parseInt(value),
              });
            }}
            setForm={setform}
            form={form}
          />

          <button
            onClick={savePassword}
            className="flex justify-center items-center gap-2 bg-green-400 w-fit px-5 py-1.5 hover:bg-green-300 rounded-full border border-green-900 mt-6"
          >
            <lord-icon
              src="https://cdn.lordicon.com/jgnvfzqg.json"
              trigger="hover"
            ></lord-icon>
            Save Password
          </button>
        </div>
        
        <h2 className="font-bold text-xl font-sans py-4">Your Passwords</h2>
        
        {/* Password List Component */}
        <PasswordList 
          passArray={passArray}
          handleCopytext={handleCopytext}
          HandleEdit={handleEdit}
          deletePassword={deletePasswordHandler}
        />
      </div>
    </>
  );
}

export default Manager;
