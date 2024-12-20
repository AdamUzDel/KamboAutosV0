'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronDown, Search } from 'lucide-react'

const faqs = [
  {
    question: "How do I find the right part for my vehicle?",
    answer: "You can use our 'Shop by Car' feature on the homepage. Simply select your car's make, model, year, and modification to see all compatible parts. Alternatively, you can use the search bar to look for specific parts or categories."
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 30-day return policy for most items. Parts must be in their original condition and packaging. Some restrictions may apply to certain products. Please check our full return policy for more details."
  },
  {
    question: "Do you offer international shipping?",
    answer: "Yes, we ship to many countries in East Africa. Shipping costs and delivery times vary depending on the destination. You can see the shipping options available for your location at checkout."
  },
  {
    question: "Are your parts genuine or aftermarket?",
    answer: "We offer both genuine (OEM) and high-quality aftermarket parts. Each product listing specifies whether it's an OEM or aftermarket part. We ensure all our aftermarket parts meet or exceed OEM specifications."
  },
  {
    question: "How long does shipping usually take?",
    answer: "Domestic shipping within Uganda typically takes 2-5 business days. Express shipping options are available at checkout. International shipping times vary by location, usually ranging from 7-21 business days."
  },
  {
    question: "Do you provide installation services?",
    answer: "We don't offer installation services directly, but we can recommend trusted local mechanics in your area who can install the parts you purchase from us."
  },
  {
    question: "What if I receive a damaged or incorrect part?",
    answer: "If you receive a damaged or incorrect part, please contact our customer service team immediately. We'll arrange for a replacement or refund as appropriate. Make sure to keep all original packaging and take photos of any damage for our records."
  },
  {
    question: "Can I track my order?",
    answer: "Yes, once your order ships, you'll receive a tracking number via email. You can use this number to track your package on our website or the carrier's site."
  },
  {
    question: "Do you offer warranties on your parts?",
    answer: "Yes, we offer warranties on most of our parts. The warranty period varies depending on the product and manufacturer. You can find specific warranty information on each product page."
  },
  {
    question: "How can I contact customer support?",
    answer: "You can reach our customer support team through email at support@kamboautos.com, by phone at +256 (0) 784-250-000, or by using the contact form on our website. Our support hours are Monday to Friday, 8:00 AM to 6:00 PM, and Saturday 9:00 AM to 4:00 PM."
  }
]

export default function FAQsPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Find answers to common questions about our products, services, and policies.
        </p>
      </section>

      <div className="flex items-center space-x-2">
        <Search className="w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search FAQs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
      </div>

      <div className="space-y-4">
        {filteredFaqs.map((faq, index) => (
          <Card key={index}>
            <CardHeader className="p-4">
              <Button
                variant="ghost"
                className="w-full flex justify-between items-center"
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
              >
                <CardTitle className="text-left">{faq.question}</CardTitle>
                <ChevronDown className={`h-4 w-4 transition-transform ${
                  activeIndex === index ? 'transform rotate-180' : ''
                }`} />
              </Button>
            </CardHeader>
            {activeIndex === index && (
              <CardContent className="pt-0 px-4 pb-4">
                <p>{faq.answer}</p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {filteredFaqs.length === 0 && (
        <Card>
          <CardContent className="p-4 text-center">
            <p>No matching FAQs found. Please try a different search term or check our contact page for more support options.</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-6 text-center">
          <h2 className="text-2xl font-semibold mb-4">Still have questions?</h2>
          <p className="mb-4">If you couldn&apos;t find the answer you were looking for, our customer support team is here to help.</p>
          <Button asChild>
            <a href="/contact">Contact Us</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}