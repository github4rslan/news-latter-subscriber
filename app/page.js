'use client'

import { useState } from 'react'
import { CheckCircle, Mail } from 'lucide-react'

export default function NewsletterLanding() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.email || !formData.email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    try {
      setLoading(true)
      setError('')

      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe')
      }

      setSuccess(true)
      setFormData({ firstName: '', lastName: '', email: '' })
      
      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Saudi Arabia in 5 Minutes a Day
          </h1>
          
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            Your gateway to Vision 2030—property, careers, lifestyle, and opportunities. 
            No fluff. No noise. Just the signals that matter.
          </p>

          {/* Success Message */}
          {success && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-500 rounded-r-lg p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-green-800 font-semibold text-sm">Successfully subscribed!</p>
                  <p className="text-green-700 text-xs">Check your email for confirmation.</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-r-lg p-4 shadow-sm">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Email Input - Simple */}
          <div className="max-w-md mx-auto mb-6">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@company.com"
              disabled={loading}
              className="w-full px-6 py-4 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed text-center"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full max-w-md mx-auto block py-4 px-8 bg-black hover:bg-gray-800 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mb-8"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Joining...
              </span>
            ) : (
              'Join for Free'
            )}
          </button>

          {/* Trust Indicators */}
          <div className="space-y-4 text-gray-600">
            <p className="flex items-center justify-center gap-2 text-sm">
              <span className="text-xl">🇬🇧</span>
              <span className="text-xl">🇪🇺</span>
              <span className="text-xl">🇺🇸</span>
              <span>Join 2,847 UK, European & US professionals, investors & strategic relocators</span>
            </p>
            
            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm">
                <strong>Free bonus:</strong> Get your <strong>Personalized Saudi Arabia Opportunity Map</strong>—a 10-page guide tailored to your interests
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}