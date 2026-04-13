import { UserContext } from "@/hooks/UserContext";
import React, { useContext } from "react";

export default function Profile() {
  const context = useContext(UserContext);

  if (!context) return <p>User context not available</p>;

  const { user, loading } = context;

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not found</p>;

  return (
    <div>
      <h1>Profile</h1>
      <p>Email: {user.email}</p>
    </div>
  );
}
