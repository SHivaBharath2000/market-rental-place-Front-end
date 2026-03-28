import axios from "axios";
import { beUrl } from "./constants";

// Create user account
const userSignup = async (userData) => {
  try {
    const response = await axios.post(`${beUrl}/register`, userData, {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error during user signup:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

const userSignIn = async (userData) => {
  try {
    const response = await axios.post(`${beUrl}/login`, userData, {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error during user signin:", error);
    throw error;
  }
};

const addEquipment = async (userData) => {
  try {
    const response = await axios.post(`${beUrl}/addEquip`, userData, {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error occur in add equipment:", error);
    throw error;
  }
};
const getEquipments = async () => {
  try {
    const response = await axios.get(`${beUrl}/addEquip`, {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error occur in get equipment:", error);
    throw error;
  }
};

const bookings = async (userData) => {
  try {
    const response = await axios.post(`${beUrl}/bookings`, userData, {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error occur in booking the equipment:", error);
    throw error;
  }
};

const getbookings = async () => {
  try {
    const response = await axios.get(`${beUrl}/getBookings`, {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error occur in get bookings:", error);
    throw error;
  }
};
const forgotPassword = async (userData) => {
  try {
    const response = await axios.post(`${beUrl}/forgotPassword`, userData, {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error during send mail:", error);
    throw error;
  }
};
const resetPassword = async (userData) => {
  try {
    const response = await axios.post(`${beUrl}/resetPassword`, userData, {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error during reset the password:", error);
    throw error;
  }
};

const payment = async (userData) => {
  try {
    const response = await axios.post(`${beUrl}/payment`, userData, {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error during payment:", error);
    throw error;
  }
};
const stripePayment = async (token, amount, name) => {
  try {
    const response = await axios.post(
      `${beUrl}/stripePayment`,
      {
        token: token,
        amount: amount,
        name: name
      },
      {
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error during stripe payment:", error);
    throw error;
  }
};

const savePayment = async (userData) => {
  try {
    const response = await axios.post(
      `${beUrl}/savePayment`,
      userData,
      {
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error during save the payment:", error);
    throw error;
  }
};

export {
  userSignup,
  userSignIn,
  addEquipment,
  getEquipments,
  bookings,
  getbookings,
  forgotPassword,
  resetPassword,
  payment,
  stripePayment,
  savePayment
};
