import { useState } from 'react';
import axios from 'axios';

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    setLoading(true);
    try {
      await axios.post('/api/send-reset-otp', { email });
      setMessage('OTP sent to your email');
      setStep(2);
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Error sending OTP');
    }
    setLoading(false);
  };

  const verifyOtp = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/reset-password', {
        email,
        otp,
        newPassword: 'dummy' // just to trigger otp check
      });

      if (response.data.message === 'OTP verified') {
        setStep(3);
        setMessage('');
      }
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Invalid OTP');
    }
    setLoading(false);
  };

  const resetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setMessage('Please fill both password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/reset-password', {
        email,
        otp,
        newPassword,
      });
      setMessage('Password reset successfully. Please login.');
      setStep(1);
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Error resetting password');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-lg shadow-lg bg-white space-y-4">
      <h2 className="text-2xl font-bold text-center">Forgot Password</h2>

      {step === 1 && (
        <>
          <input
            type="email"
            placeholder="Enter your admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button
            onClick={sendOtp}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <div className="flex gap-2">
            <button
              onClick={verifyOtp}
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button
              onClick={sendOtp}
              disabled={loading}
              className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
            >
              Resend OTP
            </button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            placeholder="Re-enter New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button
            onClick={resetPassword}
            disabled={loading}
            className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </>
      )}

      {message && <p className="text-center text-sm text-red-600">{message}</p>}
    </div>
  );
}
