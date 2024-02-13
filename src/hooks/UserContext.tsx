import { createContext, useContext, useState, useEffect } from "react";

export const userContextInitialValues = {
  user: "",
  loading: true,
  setUser: () => {},
  fetchUser: () => {},
};
export const UserContext = createContext(userContextInitialValues);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const fetchUser = async () => {
    try {
      const response = await fetch("/api/user");
      const userData = await response.json();
      console.log("userData :>> ", userData);
      setUser(userData);
    } catch (error) {
      console.error("error", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};
