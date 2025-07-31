import { useState } from 'react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [resetMode, setResetMode] = useState(false)
  const [step, setStep] = useState(1) // 1: Enter email, 2: OTP, 3: new passwords
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRequestOTP = async () => {
    setLoading(true)
    try {
      const endpoint = resetMode ? '/api/forgot-password' : '/api/login'
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      })
      const data = await res.json()
      alert(data.message)
      if (res.ok) {
        setOtpSent(true)
        setStep(2)
      }
    } catch (err) {
      alert('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResetOTP = async () => {
    setLoading(true)
    try {
      const endpoint = '/api/send-reset-otp' 
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = await res.json()
      alert(data.message)
      if (res.ok) {
        setOtpSent(true)
        setStep(2)
      }
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
        body: JSON.stringify({ email: email.trim(), otp: otp.trim() }),
      })
      const data = await res.json()
      if (res.ok) {
        alert('Login successful')
        window.location.href = '/'
      } else {
        alert(data.message || 'OTP verification failed')
      }
    } catch (err) {
      alert('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTPForReset = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/verify-reset-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), otp: otp.trim() }),
      })
      const data = await res.json()
      if (res.ok) {
        alert('OTP Verified')
        setStep(3)
      } else {
        alert(data.message)
      }
    } catch (err) {
      alert('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) return alert('Passwords do not match')

    setLoading(true)
    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), newPassword: newPassword.trim() }),
      })
      const data = await res.json()
      if (res.ok) {
        alert('Password reset successful. You can now log in.')
        window.location.reload()
      } else {
        alert(data.message || 'Failed to reset password')
      }
    } catch (err) {
      alert('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 mt-20 sm:p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">{resetMode ? 'Reset Password' : 'Admin Login'}</h1>

      <label className="block text-gray-700 mb-1 font-medium">Admin Email</label>
      <input
        type="email"
        placeholder="admin@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border p-3 mb-4 rounded"
      />

      {step === 1 && !resetMode && (
        <>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-3 mb-4 rounded"
          />
          <button
            onClick={handleRequestOTP}
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading || !email || !password}
          >
            {loading ? 'Sending OTP...' : 'Send OTP to Email'}
          </button>
        </>
      )}

      {step === 1 && resetMode && (
        <button
          onClick={handleResetOTP}
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading || !email}
        >
          {loading ? 'Sending OTP...' : 'Send OTP for Reset'}
        </button>
      )}

      {step === 2 && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full border p-3 mb-4 rounded"
          />
          <button
            onClick={resetMode ? handleVerifyOTPForReset : handleLogin}
            className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 disabled:opacity-50"
            disabled={loading || !otp}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </>
      )}

      {step === 3 && resetMode && (
        <>
          <input
            type="password"
            placeholder="Enter New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border p-3 mb-4 rounded"
          />
          <input
            type="password"
            placeholder="Re-enter New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border p-3 mb-4 rounded"
          />
          <button
            onClick={handleResetPassword}
            className="w-full bg-purple-600 text-white py-3 rounded hover:bg-purple-700 disabled:opacity-50"
            disabled={loading || !newPassword || !confirmPassword}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </>
      )}

      <div className="text-center mt-4">
        <button
          className="text-sm text-blue-600 underline"
          onClick={() => {
            setResetMode(!resetMode)
            setStep(1)
            setOtpSent(false)
            setOtp('')
            setNewPassword('')
            setConfirmPassword('')
          }}
        >
          {resetMode ? 'Back to Login' : 'Forgot Password?'}
        </button>
      </div>
    </div>
  )
}
