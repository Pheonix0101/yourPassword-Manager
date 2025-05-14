// Utility functions for password handling

// Function to check password strength
export const checkPasswordStrength = (password) => {
  let score = 0;
  let message = "";
  let color = "gray";

  if (!password) {
    return { score: 0, message: "", color: "gray" };
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

  return { score, message, color };
}; 