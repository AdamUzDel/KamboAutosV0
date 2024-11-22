'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { Review } from '@prisma/client'

interface ReviewsProps {
  productId: string
  initialReviews: Review[]
}

export function Reviews({ productId, initialReviews }: ReviewsProps) {
  const [reviews, setReviews] = useState(initialReviews)
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' })
  const { data: session } = useSession()
  const { toast } = useToast()

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) {
      toast({
        title: 'Error',
        description: 'You must be logged in to submit a review.',
        variant: 'destructive',
      })
      return
    }

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newReview, productId }),
      })

      if (response.ok) {
        const savedReview = await response.json()
        setReviews([...reviews, savedReview])
        setNewReview({ rating: 0, comment: '' })
        toast({
          title: 'Review submitted',
          description: 'Thank you for your feedback!',
        })
      } else {
        throw new Error('Failed to submit review')
      }
    } catch (error) {
      console.log('Error submitting review:', error instanceof Error ? error.message : error)
      toast({
        title: 'Error',
        description: 'Failed to submit review. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
      {reviews.map((review) => (
        <div key={review.id} className="mb-4 p-4 border rounded">
          <div className="flex items-center mb-2">
            <div className="flex text-yellow-400 mr-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={i < review.rating ? 'fill-current' : 'stroke-current'}
                />
              ))}
            </div>
            <span className="font-semibold">{review.userId}</span>
          </div>
          <p>{review.comment}</p>
        </div>
      ))}
      {session && (
        <form onSubmit={handleSubmitReview} className="mt-4">
          <h3 className="text-xl font-semibold mb-2">Write a Review</h3>
          <div className="flex items-center mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`cursor-pointer ${
                  i < newReview.rating ? 'text-yellow-400 fill-current' : 'text-gray-300 stroke-current'
                }`}
                onClick={() => setNewReview({ ...newReview, rating: i + 1 })}
              />
            ))}
          </div>
          <Textarea
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value  })}
            placeholder="Write your review here..."
            className="mb-2"
            required
          />
          <Button type="submit">Submit Review</Button>
        </form>
      
      )}
    </div>
  )
}