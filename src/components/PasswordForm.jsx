import React from 'react';
import { IoEye } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";
import PasswordStrengthIndicator from './PasswordStrengthIndicator';

function PasswordForm({ 
  form, 
  handleChange,
  passwordRef,
  passRef,
  showPassword,
  handlePassword,
  passwordStrength,
  setPasswordFocused,
  setIsGeneratorClicked
}) {
  return (
    <div className="flex flex-col p-4 text-black gap-6 items-center">
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
            <PasswordStrengthIndicator passwordStrength={passwordStrength} />
          )}
        </div>
      </div>
    </div>
  );
}

export default PasswordForm; 