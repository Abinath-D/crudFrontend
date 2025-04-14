import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    Name: '',
    RollNumber: '',
    Email: '',
    Mobile: ''
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch all students
  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:9000/studentDetails');
      setStudents(response.data.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Create or Update student
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:9000/studentDetails/${editingId}`, formData);
      } else {
        await axios.post('http://localhost:9000/studentDetails', formData);
      }
      fetchStudents();
      setFormData({ Name: '', RollNumber: '', Email: '', Mobile: '' });
      setEditingId(null);
    } catch (error) {
      console.error('Error saving student:', error);
    }
  };

  // Edit student
  const handleEdit = (student) => {
    setFormData({
      Name: student.Name,
      RollNumber: student.RollNumber,
      Email: student.Email,
      Mobile: student.Mobile
    });
    setEditingId(student._id);
  };

  // Delete student
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:9000/studentDetails/${id}`);
      fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  return (
    <div className="container">
      <h1>Student Management</h1>
      
      {/* Student Form */}
      <form onSubmit={handleSubmit}>
        <h2>{editingId ? 'Edit Student' : 'Add Student'}</h2>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="Name"
            value={formData.Name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Roll Number:</label>
          <input
            type="number"
            name="RollNumber"
            value={formData.RollNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="Email"
            value={formData.Email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Mobile:</label>
          <input
            type="tel"
            name="Mobile"
            value={formData.Mobile}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">
          {editingId ? 'Update' : 'Add'} Student
        </button>
        {editingId && (
          <button type="button" onClick={() => {
            setFormData({ Name: '', RollNumber: '', Email: '', Mobile: '' });
            setEditingId(null);
          }}>
            Cancel
          </button>
        )}
      </form>

      {/* Students List */}
      <h2>Student List</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Roll Number</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>{student.Name}</td>
              <td>{student.RollNumber}</td>
              <td>{student.Email}</td>
              <td>{student.Mobile}</td>
              <td>
                <button onClick={() => handleEdit(student)}>Edit</button>
                <button onClick={() => handleDelete(student._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;