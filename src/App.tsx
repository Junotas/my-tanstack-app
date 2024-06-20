import React, { useState } from "react";
import "./App.css";
import { useUsers } from "./useUsers";

const App: React.FC = () => {
  const { isLoading, error, data: users, refetch } = useUsers(); // Use refetch to update data after adding a user
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
    // Wait for the users data to be available
    await refetch();

    // Now you can safely access the users data
    if (
      users &&
      users.some(
        (user) => user.name.toLowerCase() === newUserName.toLowerCase()
      )
    ) {
      alert(`User "${newUserName}" already exists.`);
      return;
    }

    // Generate a new id (you might want to ensure uniqueness in a real scenario)
    const newUserId =
      users && users.length > 0 ? users[users.length - 1].id + 1 : 1;
    const newUser: User = { id: newUserId, name: newUserName };

    // Update localStorage
    const updatedUsers = [...(users || []), newUser]; // Use empty array fallback if users is still undefined
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    // Clear the input field and trigger a refetch to update the UI
    setNewUserName("");
    await refetch(); // Refetch again to update with the newly added user
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
        <SearchResults users={filteredUsers} />
      </main>
    </div>
  );
};

interface User {
  id: number;
  name: string;
}

const SearchResults: React.FC<{ users: User[] }> = ({ users }) => {
  if (users.length === 0) {
    return <p>No users found.</p>;
  }

  return (
    <ul className="user-list">
      {users.map((user) => (
        <li key={user.id} className="user-item">
          {user.name}
        </li>
      ))}
    </ul>
  );
};

export default App;
