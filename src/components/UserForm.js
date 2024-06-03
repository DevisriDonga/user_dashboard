import React, { useState } from 'react';
import axios from 'axios';

const UserForm = ({ refreshUsers }) => {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = { name, dob, contact, email, description };
    try {
      await axios.post('http://localhost:3001/users', newUser);
      refreshUsers();
    } catch (error) {
      console.error('There was an error creating the user!', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        required
      />
      <input
        type="date"
        value={dob}
        onChange={(e) => setDob(e.target.value)}
        required
      />
      <input
        type="text"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        placeholder="Contact"
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="User Description"
        required
      ></textarea>
      <button type="submit">Create User</button>
    </form>
  );
};

export default UserForm;
