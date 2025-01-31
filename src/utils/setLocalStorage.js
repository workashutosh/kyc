import secureLocalStorage from "react-secure-storage";

// function to set the local storage
export const setLocalStorage = (
  access_token,
  access_token_expiry,
  refresh_token,
  refresh_token_expiry,
  session_id,
  position
) => {
  const data = {
    access_token: access_token,
    access_token_expiry: access_token_expiry,
    refresh_token: refresh_token,
    refresh_token_expiry: refresh_token_expiry,
    session_id: session_id,
    position: position,
  };
  secureLocalStorage.setItem("data", data);
};


