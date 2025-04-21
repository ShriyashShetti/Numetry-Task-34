import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStar, FaSearch } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [contacts, setContacts] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchContacts();
  }, [showFavorites, search]);

  const fetchContacts = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/contacts`, {
        params: {
          favorite: showFavorites || undefined,
          search: search || undefined
        }
      });
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const toggleFavorite = async (id) => {
    try {
      await axios.put(`http://localhost:8080/contacts/${id}/favorite`);
      fetchContacts();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <div className="container py-5" style={{ background: '#f0f8ff', minHeight: '100vh' }}>
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold text-primary">📇 Contact Book</h1>
        <p className="text-muted">Manage your contacts, mark favorites ⭐ and search easily</p>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <input
          type="text"
          placeholder="Search by name, phone, or email"
          className="form-control me-2 shadow-sm"
          style={{ maxWidth: '400px' }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className={`btn ${showFavorites ? 'btn-warning' : 'btn-outline-warning'} shadow-sm`}
          onClick={() => setShowFavorites(!showFavorites)}
        >
          {showFavorites ? '⭐ Showing Favorites' : '⭐ Show Favorites'}
        </button>
      </div>

      <div className="row g-4">
        {contacts.length === 0 ? (
          <p className="text-muted text-center">No contacts found.</p>
        ) : (
          contacts.map((contact) => (
            <div className="col-md-6 col-lg-4" key={contact.id}>
              <div className="card h-100 border-0 shadow-sm contact-card animate__animated animate__fadeInUp">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="card-title mb-0 text-dark">{contact.name}</h5>
                    <FaStar
                      className={`star-icon ${contact.is_favorite ? 'text-warning' : 'text-secondary'}`}
                      style={{ cursor: 'pointer', fontSize: '1.2rem', transition: '0.3s' }}
                      onClick={() => toggleFavorite(contact.id)}
                    />
                  </div>
                  <p className="mb-1"><strong>📞 Phone:</strong> {contact.phone}</p>
                  <p className="mb-1"><strong>📧 Email:</strong> {contact.email}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
