import { UserContext } from "@/hooks/UserContext";
import React, { useContext } from "react";

export default function Profile() {
  const { user, loading } = useContext(UserContext);

  if (loading)
    return (
      <div>
        {" "}
        <p>Loading...</p>
      </div>
    );
  if (!user) return <div>User not found</div>;

  return (
    <div>
      <h1>Profile</h1>
      <p>name: {user.email}</p>
    </div>
  );
}
