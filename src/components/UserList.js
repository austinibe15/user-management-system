import React, { useState, useEffect } from 'react';
import axios from 'axios';
import User from './User';

/**
 * UserList
 * - Renders a list of users using the User component
 * - No heading here to avoid duplicates
 * - Handles both `id` and `_id` as possible identifier fields
 * - Provides a safe default for `users`
 */

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/users')
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching users:", error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        users.map((user) => {
          const id = user?.id ?? user?._id;
          return id ? <User key={id} user={user} setUsers={setUsers} /> : null;
        })
      )}
    </div>
  );
};

export default UserList;