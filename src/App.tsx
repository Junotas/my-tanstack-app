import React, { useState } from "react";
import "./App.css";
import { useUsers } from "./useUsers";

const App: React.FC = () => {
  const { isLoading, error, data: users, refetch } = useUsers();
  const [searchTerm, setSearchTerm] = useState("");
  const [newUserName, setNewUserName] = useState("");

  const filteredUsers = users
    ? users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleAddUser = async () => {
    await refetch();

    if (
      users &&
      users.some(
        (user) => user.name.toLowerCase() === newUserName.toLowerCase()
      )
    ) {
      alert(`User "${newUserName}" already exists.`);
      return;
    }

    const newUserId =
      users && users.length > 0 ? users[users.length - 1].id + 1 : 1;
    const newUser: User = { id: newUserId, name: newUserName };

    const updatedUsers = [...(users || []), newUser];
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    setNewUserName("");
    await refetch();
  };

  const handleRemoveUser = async (userId: number) => {
    if (!window.confirm("Are you sure you want to remove this user?")) {
      return;
    }

    await refetch(); // Ensure users data is up-to-date

    if (!users) {
      console.error("Users data is not available.");
      return;
    }

    const updatedUsers = users.filter((user) => user.id !== userId);
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    await refetch(); // Refetch to update UI after removal
  };

  if (isLoading) return <div className="container">Loading...</div>;

  if (error) return <div className="container">Error: {error.message}</div>;

  return (
    <div className="container">
      <header>
        <h1>User Search</h1>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search users..."
          className="search-input"
        />
      </header>
      <main>
        <div className="add-user">
          <input
            type="text"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            placeholder="Enter new user name..."
            className="add-user-input"
          />
          <button
            onClick={handleAddUser}
            disabled={!newUserName}
            className="add-user-btn"
          >
            Add User
          </button>
        </div>
        <SearchResults users={filteredUsers} onRemoveUser={handleRemoveUser} />
      </main>
    </div>
  );
};

interface User {
  id: number;
  name: string;
}

const SearchResults: React.FC<{
  users: User[];
  onRemoveUser: (userId: number) => void;
}> = ({ users, onRemoveUser }) => {
  if (users.length === 0) {
    return <p>No users found.</p>;
  }

  return (
    <ul className="user-list">
      {users.map((user) => (
        <li key={user.id} className="user-item">
          {user.name}
          <button
            onClick={() => onRemoveUser(user.id)}
            className="remove-user-btn"
          >
            Remove
          </button>
        </li>
      ))}
    </ul>
  );
};

export default App;
