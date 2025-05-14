import React from 'react';

function PasswordStrengthIndicator({ passwordStrength, score }) {
  return (
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
  );
}

export default PasswordStrengthIndicator; 