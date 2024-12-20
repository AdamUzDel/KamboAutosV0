'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { MapPin, Phone, Mail, Clock, Facebook, Twitter, Instagram } from 'lucide-react'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the form data to your backend
    // For now, we'll just simulate a successful submission
    toast({
      title: "Message Sent",
      description: "We'll get back to you as soon as possible.",
    })
    setName('')
    setEmail('')
    setMessage('')
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          We&apos;re here to help. Reach out to us for any inquiries or support you need.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Send Us a Message</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  placeholder="How can we help you?"
                  rows={4}
                />
              </div>
              <Button type="submit" className="w-full">Send Message</Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-muted-foreground" />
                <p>Old Kampala Rd, Kampala, Uganda</p>
              </div>
              <div className="flex items-center">
                <Phone className="mr-2 h-5 w-5 text-muted-foreground" />
                <p>+256 (0) 784-250-000</p>
              </div>
              <div className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-muted-foreground" />
                <p>support@kamboautos.com</p>
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
                <div>
                  <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                  <p>Saturday: 9:00 AM - 4:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Follow Us</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-around">
              <a href="#" className="text-blue-600 hover:text-blue-800">
                <Facebook className="h-8 w-8" />
              </a>
              <a href="#" className="text-blue-400 hover:text-blue-600">
                <Twitter className="h-8 w-8" />
              </a>
              <a href="#" className="text-pink-600 hover:text-pink-800">
                <Instagram className="h-8 w-8" />
              </a>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">What is your return policy?</h3>
              <p className="text-muted-foreground">We offer a 30-day return policy for most items. Please check our full return policy for more details.</p>
            </div>
            <div>
              <h3 className="font-semibold">Do you offer international shipping?</h3>
              <p className="text-muted-foreground">Yes, we ship to many countries in East Africa. Shipping costs and delivery times vary depending on the destination.</p>
            </div>
            <div>
              <h3 className="font-semibold">How can I track my order?</h3>
              <p className="text-muted-foreground">Once your order ships, you&apos;ll receive a tracking number via email. You can use this number to track your package on our website.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}