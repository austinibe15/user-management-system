import React, { useState } from 'react';

const SignupForm = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState(''); // Add state for age
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Validation function
  const validate = () => {
    if (!name.trim()) return 'Name is required';
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email';
    if (!password || password.length < 8) return 'Password must be at least 8 characters';
    if (!age || isNaN(age) || age <= 0) return 'Please enter a valid age'; // Validate age
    return null;
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await onSubmit(name, email, password, age); // Pass age to the parent component
      // Clear the form fields upon success
      setName('');
      setEmail('');
      setPassword('');
      setAge('');
    } catch (err) {
      setError(err?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} aria-label="Signup form">
      <div>
        <label htmlFor="signup-name">Name:</label>
        <input
          id="signup-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          aria-describedby="name-error"
        />
        {error && error.includes('Name') && <p id="name-error" style={{ color: 'red' }}>{error}</p>}
      </div>
      <div>
        <label htmlFor="signup-email">Email:</label>
        <input
          id="signup-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-describedby="email-error"
        />
        {error && error.includes('Email') && <p id="email-error" style={{ color: 'red' }}>{error}</p>}
      </div>
      <div>
        <label htmlFor="signup-password">Password:</label>
        <input
          id="signup-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          aria-describedby="password-error"
        />
        {error && error.includes('Password') && <p id="password-error" style={{ color: 'red' }}>{error}</p>}
      </div>
      <div>
        <label htmlFor="signup-age">Age:</label>  {/* Added Age Input Field */}
        <input
          id="signup-age"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
          aria-describedby="age-error"
        />
        {error && error.includes('Age') && <p id="age-error" style={{ color: 'red' }}>{error}</p>}
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Signing up...' : 'Signup'}
      </button>
      {error && !error.includes('Name') && !error.includes('Email') && !error.includes('Password') && !error.includes('Age') && (
        <p style={{ color: 'red' }}>{error}</p>
      )}
    </form>
  );
};

export default SignupForm;
