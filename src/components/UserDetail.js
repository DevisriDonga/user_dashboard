import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', dob: '', contact: '', email: '', description: '' });

  const fetchUser = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:3001/users/${id}`);
      setUser(response.data);
      setFormData(response.data);
    } catch (error) {
      console.error('There was an error fetching the user details!', error);
    }
  }, [id]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/users/${id}`);
      navigate('/');
    } catch (error) {
      console.error('There was an error deleting the user!', error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3001/users/${id}`, formData);
      setIsEditing(false);
      fetchUser();
    } catch (error) {
      console.error('There was an error updating the user!', error);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      {isEditing ? (
        <form onSubmit={handleUpdate}>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Name"
            required
          />
          <input
            type="date"
            value={formData.dob}
            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
            required
          />
          <input
            type="text"
            value={formData.contact}
            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            placeholder="Contact"
            required
          />
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Email"
            required
          />
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="User Description"
            required
          ></textarea>
          <button type="submit">Update User</button>
        </form>
      ) : (
        <div>
          <h2>{user.name}</h2>
          <p>Date of Birth: {user.dob}</p>
          <p>Contact: {user.contact}</p>
          <p>Email: {user.email}</p>
          <p>Description: {user.description}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default UserDetail;
