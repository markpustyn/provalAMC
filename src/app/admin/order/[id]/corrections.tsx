'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'

interface Correction {
  id: string
  orderId: string
  comments: string
  createdAt?: string
}

export default function Corrections({ orderId }: { orderId: string }) {
  const [comments, setComments] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [allCorrections, setAllCorrections] = useState<Correction[]>([])

  // Fetch all existing corrections for this order
  useEffect(() => {
    const fetchCorrections = async () => {
      if (!orderId) return
      try {
        const res = await fetch(`/api/corrections?id=${orderId}`)
        if (!res.ok) throw new Error('Failed to fetch corrections')
        const data = await res.json()
        if (Array.isArray(data)) {
          setAllCorrections(data)
        } else if (data?.comments) {
          setAllCorrections([data])
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchCorrections()
  }, [orderId])

  // Save a new correction
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderId) return alert('Missing order id')
    setSaving(true)
    try {
      const res = await fetch(`/api/corrections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comments, orderId }),
      })
      if (!res.ok) throw new Error(await res.text())

      toast('Correction submitted')
      setComments('')

      // refresh list
      const updated = await fetch(`/api/corrections?id=${orderId}`)
      const newData = await updated.json()
      setAllCorrections(Array.isArray(newData) ? newData : [newData])
    } catch (err) {
      console.error(err)
      toast('Error saving correction', { description: String(err) })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="p-6 text-gray-500">Loading corrections...</p>

  return (
    <div className="p-6 w-1/3 py-12">
      <h1 className="text-2xl font-semibold mb-3">Correction Notes</h1>

      <form onSubmit={handleSubmit}>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          className="w-full border p-2 rounded mb-3 h-32"
          placeholder="Enter correction notes..."
        />
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </form>

      {/* Display all saved corrections */}
      <div className="mt-6 space-y-3">
        <h2 className="text-lg font-semibold">Previous Corrections</h2>
        {allCorrections.length === 0 ? (
          <p className="text-gray-500">No order corrections.</p>
        ) : (
          allCorrections.map((correction) => (
            <div
              key={correction.id || correction.comments}
              className="border rounded p-3 bg-gray-50"
            >
              <p className="text-gray-700">{correction.comments}</p>
              {correction.createdAt}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
