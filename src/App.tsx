import React, { useState } from 'react';
import './App.css';
import { useUsers } from './useUsers';

const App: React.FC = () => {
  const { isLoading, error, data: users } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users
    ? users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
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
      {users.map(user => (
        <li key={user.id} className="user-item">
          {user.name}
        </li>
      ))}
    </ul>
  );
};

export default App;
