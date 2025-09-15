import React, { useState } from 'react';

const LoginForm = ({ onSubmit, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState(''); // Local error state for form validation
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state for submit

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous error
    setFormError('');

    // Simple client-side validation
    if (!email || !password) {
      setFormError('Email and password are required.');
      return;
    }

    setIsSubmitting(true); // Start loading

    try {
      await onSubmit(email, password); // Submit the login form
      setEmail(''); // Clear email field after successful login
      setPassword(''); // Clear password field after successful login
    } catch (err) {
      // Handle error if the submit fails
      setFormError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false); // End loading
    }
  };

  // Clear global error when the user starts typing
  const handleInputChange = () => {
    if (formError || error) {
      setFormError(''); // Clear form error when typing starts
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email:</label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => { setEmail(e.target.value); handleInputChange(); }} 
          required 
        />
      </div>
      <div>
        <label>Password:</label>
        <input 
          type="password" 
          value={password} 
          onChange={(e) => { setPassword(e.target.value); handleInputChange(); }} 
          required 
        />
      </div>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Logging in...' : 'Login'}
      </button>
      
      {/* Display form-level errors */}
      {formError && <p style={{ color: 'red' }}>{formError}</p>}

      {/* Display global error (passed from parent component) */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default LoginForm;
