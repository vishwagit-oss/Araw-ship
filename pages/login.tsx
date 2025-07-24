import { useState } from 'react'

export default function Login() {
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleRequestOTP = async () => {
    if (!password) return alert('Enter password')
    setLoading(true)
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ email: 'vishwagohil21@gmail.com', password }),
    })
    const data = await res.json()
    alert(data.message)
    if (res.ok) setOtpSent(true)
    setLoading(false)
  }

  const handleLogin = async () => {
    if (!otp) return alert('Enter OTP')
    setLoading(true)
    const res = await fetch('/api/verify-otp', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ email: 'vishwagohil21@gmail.com', otp }),
    })
    const data = await res.json()
    if (res.ok) {
      alert('Login successful')
      window.location.href = '/'
    } else alert(data.message)
    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto p-6 mt-20">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Login</h1>
      <input type="password" placeholder="Password" value={password}
        onChange={e => setPassword(e.target.value)}
        className="w-full border p-2 mb-4"/>
      {!otpSent ? (
        <button onClick={handleRequestOTP}
          className="w-full bg-blue-600 text-white py-2 rounded"
          disabled={loading}>
          {loading ? 'Sending OTP...' : 'Send OTP to Email'}
        </button>
      ) : (
        <>
          <input type="text" placeholder="Enter OTP" value={otp}
            onChange={e => setOtp(e.target.value)}
            className="w-full border p-2 mb-4"/>
          <button onClick={handleLogin}
            className="w-full bg-green-600 text-white py-2 rounded"
            disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </>
      )}
    </div>
  )
}
