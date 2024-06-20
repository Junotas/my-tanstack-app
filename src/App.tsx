// src/App.tsx
import React, { useState } from 'react';
import { useUsers } from './useUsers';

const App: React.FC = () => {
  const { data, error, isLoading } = useUsers();
  const [search, setSearch] = useState('');

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const filteredUsers = data?.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1>Users</h1>
      <input
        type="text"
        placeholder="Search users"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <ul>
        {filteredUsers?.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
