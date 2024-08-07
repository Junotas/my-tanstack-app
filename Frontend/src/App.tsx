import React, { useState, useEffect } from "react";
import "./css/App.css";
import { useUsers } from "./useUsers";

const LOADING_MESSAGE = "Loading...";
const ERROR_PREFIX = "Error: ";
const USER_EXISTS_MESSAGE = (userName: string) =>
  `User "${userName}" already exists.`;
const NO_USERS_FOUND_MESSAGE = "No users found.";
const RESET_BUTTON_TEXT = "Reset to Original";
const SEARCH_PLACEHOLDER = "Search users...";
const ADD_USER_PLACEHOLDER = "Enter new user name...";
const REMOVE_CONFIRMATION_MESSAGE =
  "Are you sure you want to remove this user?";
const ERROR_RESETTING_USERS = "Error resetting users:";

const App: React.FC = () => {
  const { isLoading, error, data: users, refetch } = useUsers();
  const [localUsers, setLocalUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newUserName, setNewUserName] = useState("");

  useEffect(() => {
    if (users) {
      setLocalUsers(users);
    }
  }, [users]);

  const filteredUsers = localUsers.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleAddUser = async () => {
    if (
      localUsers.some(
        (user) => user.name.toLowerCase() === newUserName.toLowerCase()
      )
    ) {
      alert(USER_EXISTS_MESSAGE(newUserName));
      return;
    }

    const newUserId =
      localUsers.length > 0 ? localUsers[localUsers.length - 1].id + 1 : 1;
    const newUser: User = { id: newUserId, name: newUserName };

    const updatedUsers = [...localUsers, newUser];
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    setNewUserName("");
    setLocalUsers(updatedUsers);
    await refetch();
  };

  const handleRemoveUser = async (userId: number) => {
    if (!window.confirm(REMOVE_CONFIRMATION_MESSAGE)) {
      return;
    }

    const updatedUsers = localUsers.filter((user) => user.id !== userId);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setLocalUsers(updatedUsers);
    await refetch();
  };

  const handleResetUsers = async () => {
    try {
      const response = await fetch("/data.json");
      const newData = await response.json();

      localStorage.setItem("users", JSON.stringify(newData));
      setLocalUsers(newData);
      await refetch();
    } catch (error) {
      console.error(ERROR_RESETTING_USERS, error);
    }
  };

  if (isLoading) return <div className="container">{LOADING_MESSAGE}</div>;

  if (error)
    return (
      <div className="container">
        {ERROR_PREFIX}
        {error.message}
      </div>
    );

  return (
    <div className="container">
      <header>
        <h1>Masagal Search</h1>
        <button onClick={handleResetUsers} className="reset-btn">
          {RESET_BUTTON_TEXT}
        </button>
      </header>
      <main>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder={SEARCH_PLACEHOLDER}
          className="search-input"
        />
        <div className="add-user">
          <input
            type="text"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            placeholder={ADD_USER_PLACEHOLDER}
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
    return <p>{NO_USERS_FOUND_MESSAGE}</p>;
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