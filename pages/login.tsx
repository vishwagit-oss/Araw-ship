import { useState } from 'react'

export default function Login() {
  const [email] = useState('vishwagohil21@gmail.com') // fixed for admin
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleRequestOTP = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      })

      const data = await res.json()
      alert(data.message)
      if (res.ok) setOtpSent(true)
    } catch (err) {
      alert('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
          otp: otp.trim(),
        }),
      })

      const data = await res.json()
      if (res.ok) {
        alert('Login successful')
        window.location.href = '/' // redirect to home
      } else {
        alert(data.message || 'OTP verification failed')
      }
    } catch (err) {
      alert('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 mt-20">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Login</h1>

      <label className="block text-gray-700 mb-1 font-medium">Admin Email</label>
      <input
        type="email"
        value={email}
        readOnly
        className="w-full border p-2 mb-4 bg-gray-100 text-gray-800 font-medium cursor-default"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border p-2 mb-4"
      />

      {!otpSent ? (
        <button
          onClick={handleRequestOTP}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading || !password}
        >
          {loading ? 'Sending OTP...' : 'Send OTP to Email'}
        </button>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full border p-2 mb-4"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
            disabled={loading || !otp}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </>
      )}
    </div>
  )
}
