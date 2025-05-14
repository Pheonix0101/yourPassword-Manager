import React from 'react';
import { toast } from 'react-toastify';

function PasswordGenerator({ 
  showGenerator, 
  handleGeneratorToggle, 
  canShowGenerator, 
  generatorRef, 
  setIsGeneratorClicked,
  passwordOptions,
  handlePasswordOptionChange,
  setForm,
  form
}) {

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
    
    setForm({ ...form, password });
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

  return (
    <>
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
    </>
  );
}

export default PasswordGenerator; 