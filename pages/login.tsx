import { useState } from 'react'
import { Mail, Lock, KeyRound, Loader2 } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [resetMode, setResetMode] = useState(false)
  const [step, setStep] = useState(1)
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
    } catch {
      alert('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResetOTP = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/send-reset-otp', {
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
    } catch {
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
    } catch {
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
    } catch {
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
    } catch {
      alert('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-purple-100 to-pink-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8 space-y-6 animate-fade-in">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          {resetMode ? '🔐 Reset Password' : '🔑 Admin Login'}
        </h1>

        <div className="space-y-4">
          <div className="flex items-center gap-2 border rounded px-3 py-2">
            <Mail size={18} className="text-gray-500" />
            <input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full outline-none"
            />
          </div>

          {step === 1 && !resetMode && (
            <>
              <div className="flex items-center gap-2 border rounded px-3 py-2">
                <Lock size={18} className="text-gray-500" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full outline-none"
                />
              </div>
              <button
                onClick={handleRequestOTP}
                disabled={loading || !email || !password}
                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition-all duration-300 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Send OTP to Email'}
              </button>
            </>
          )}

          {step === 1 && resetMode && (
            <button
              onClick={handleResetOTP}
              disabled={loading || !email}
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Send OTP for Reset'}
            </button>
          )}

          {step === 2 && (
            <>
              <div className="flex items-center gap-2 border rounded px-3 py-2">
                <KeyRound size={18} className="text-gray-500" />
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full outline-none"
                />
              </div>
              <button
                onClick={resetMode ? handleVerifyOTPForReset : handleLogin}
                disabled={loading || !otp}
                className="w-full bg-green-600 text-white font-semibold py-3 rounded-md hover:bg-green-700 transition-all duration-300 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Verify OTP'}
              </button>
            </>
          )}

          {step === 3 && resetMode && (
            <>
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border px-3 py-2 rounded outline-none"
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border px-3 py-2 rounded outline-none"
              />
              <button
                onClick={handleResetPassword}
                disabled={loading || !newPassword || !confirmPassword}
                className="w-full bg-purple-600 text-white font-semibold py-3 rounded-md hover:bg-purple-700 transition-all duration-300 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Reset Password'}
              </button>
            </>
          )}
        </div>

        <div className="text-center">
          <button
            className="text-sm text-blue-600 underline hover:text-blue-800 transition"
            onClick={() => {
              setResetMode(!resetMode)
              setStep(1)
              setOtpSent(false)
              setOtp('')
              setNewPassword('')
              setConfirmPassword('')
            }}
          >
            {resetMode ? '← Back to Login' : 'Forgot Password?'}
          </button>
        </div>
      </div>
    </div>
  )
}
  