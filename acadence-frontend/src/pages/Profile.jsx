import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Profile() {
  const { user, logout } = useContext(AuthContext);

  if (!user) return <p className="text-center mt-10 text-white">Not logged in</p>;

  return (
    <div className="bg-slate-900 text-white min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">Profile</h1>
      <p className="mt-4">Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <button onClick={logout} className="mt-6 bg-red-500 px-4 py-2 rounded">Logout</button>
    </div>
  );
}
