import { useState } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes

const ForgotPassword = ({ onClose }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('If your email is registered, you will receive a password reset link.');
            } else {
                setMessage(data.message || 'Something went wrong.');
            }
        } catch (error) {
            setMessage('Error: ' + error.message);
        }
    };

    return (
        <div>
            <h2>Forgot Password</h2>
            <form onSubmit={handleSubmit}>
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Send Reset Link</button>
            </form>
            {message && <p>{message}</p>}
            <button onClick={onClose}>Close</button> {/* Close button if you want to close the modal */}
        </div>
    );
};

ForgotPassword.propTypes = {
    onClose: PropTypes.func.isRequired, // Validate that onClose is a required function
};

export default ForgotPassword;
