// API Service for password manager

const API_URL = 'http://localhost:3000';

// Fetch all passwords
export const fetchPasswords = async () => {
  try {
    const response = await fetch(`${API_URL}/`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching passwords:', error);
    return [];
  }
};

// Save a new password
export const savePassword = async (passwordData) => {
  try {
    const response = await fetch(`${API_URL}/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(passwordData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error saving password:', error);
    throw error;
  }
};

// Delete a password
export const deletePassword = async (id) => {
  try {
    const response = await fetch(`${API_URL}/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting password:', error);
    throw error;
  }
}; 