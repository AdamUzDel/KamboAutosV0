"use client"

import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Award, Truck, PenToolIcon as Tool, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { Button } from "@/components/ui/button"

export default function AboutPage() {
    const [activeTab, setActiveTab] = useState('maintenance')
  
    const resources = [
      {
        id: 'maintenance',
        title: 'Maintenance Guides',
        items: [
          'How to Change Your Oil',
          'Brake Pad Replacement Guide',
          'Understanding Your Car&apos;s Cooling System',
          'Tire Rotation and Maintenance',
        ],
      },
      {
        id: 'tips',
        title: 'Car Care Tips',
        items: [
          'Extending Your Car&apos;s Lifespan in Uganda&apos;s Climate',
          'Preparing Your Vehicle for Long Trips',
          'Fuel Efficiency Tips for City Driving',
          'Keeping Your Car Clean in Dusty Conditions',
        ],
      },
      {
        id: 'blog',
        title: 'Auto Blog',
        items: [
          'Latest Automotive Trends in Uganda',
          'Understanding Import Regulations for Car Parts',
          'Spotlight on Local Auto Shows and Events',
          'Interviews with Uganda&apos;s Top Mechanics',
        ],
      },
    ]
  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-4">About Kambo Autos</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Uganda&apos;s leading auto parts supplier, committed to quality, affordability, and excellent service since 2022.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold">Our Story in Uganda</h2>
          <p className="text-muted-foreground">
            Founded in 2022, Kambo Autos has grown from a small local auto parts supplier in Kampala to Uganda&apos;s leading online marketplace for quality automotive components. 
            Our journey is driven by a passion for improving the automotive landscape in Uganda and a commitment to providing top-notch service to our customers across the country.
          </p>
          <p className="text-muted-foreground">
            With our experience in the Ugandan market, we&apos;ve built strong relationships with both local and international manufacturers and suppliers, allowing us to offer an 
            extensive range of parts for various makes and models popular in Uganda.
          </p>
        </div>
        <div className="relative h-64 md:h-96 rounded-lg overflow-hidden shadow-lg">
          <Image
            src="/car-shop.jpg?height=600&width=800"
            alt="Kambo Autos Storefront in Kampala"
            layout="fill"
            objectFit="cover"
          />
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-6 text-center">Why Choose Kambo Autos?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: CheckCircle, title: "Quality Assurance", description: "All our parts meet or exceed OEM specifications" },
            { icon: Award, title: "Expert Support", description: "Our knowledgeable team provides top-notch customer service" },
            { icon: Truck, title: "Fast Delivery", description: "Nationwide shipping to all major cities in Uganda" },
            { icon: Tool, title: "Wide Selection", description: "Extensive inventory for various makes and models" },
          ].map((item, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <item.icon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

    <section>
    <h2 className="text-3xl font-semibold mb-6 text-center">Resources</h2>
    <div className="space-y-4">
        {resources.map((resource) => (
        <Card key={resource.id}>
            <CardHeader className="p-4">
            <Button
                variant="ghost"
                className="w-full flex justify-between items-center"
                onClick={() => setActiveTab(activeTab === resource.id ? '' : resource.id)}
            >
                <CardTitle>{resource.title}</CardTitle>
                <ChevronDown className={`h-4 w-4 transition-transform ${
                activeTab === resource.id ? 'transform rotate-180' : ''
                }`} />
            </Button>
            </CardHeader>
            {activeTab === resource.id && (
            <CardContent className="pt-0 px-4 pb-4">
                <ul className="list-disc pl-5 space-y-2">
                {resource.items.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
                </ul>
            </CardContent>
            )}
        </Card>
        ))}
    </div>
    </section>

      <section>
        <h2 className="text-3xl font-semibold mb-6 text-center">Our Journey: Milestones in Uganda</h2>
        <div className="space-y-4">
          {[
            { year: 2022, event: "Kambo Autos founded in Kampala" },
            { year: 2022, event: "Launched our e-commerce platform" },
            { year: 2023, event: "Expanded to offer nationwide delivery" },
            { year: 2023, event: "Introduced our mobile app for easier parts ordering" },
            { year: 2023, event: "Established partnerships with major international auto parts manufacturers" },
            { year: 2023, event: "Reached the milestone of serving over 10,000 customers across Uganda" },
          ].map((milestone, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-24 font-bold text-primary">{milestone.year}</div>
              <div className="flex-grow border-t border-muted"></div>
              <div className="flex-shrink-0 w-3/4">{milestone.event}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-6 text-center">Customer Testimonials</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { quote: "Kambo Autos has been a game-changer for my garage in Entebbe. Their wide range of parts and quick delivery have helped me serve my customers better.", author: "John Mukasa, Mechanic in Entebbe" },
            { quote: "I've been using Kambo Autos for years to maintain my fleet of taxis. Their prices are fair, and the parts are always reliable.", author: "Sarah Namukasa, Taxi Fleet Owner in Kampala" },
          ].map((testimonial, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <p className="italic mb-4">&ldquo;{testimonial.quote}&rdquo;</p>
                <p className="font-semibold text-right">- {testimonial.author}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-6 text-center">Community Initiatives</h2>
        <Card>
          <CardContent className="pt-6">
            <p className="mb-4">At Kambo Autos, we believe in giving back to the communities we serve. Our initiatives include:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Annual scholarship program for aspiring automotive technicians in Uganda</li>
              <li>Free basic car maintenance workshops for new drivers</li>
              <li>Sponsorship of local motorsport events to promote automotive enthusiasm</li>
              <li>Tree planting drives to offset our carbon footprint and contribute to a greener Uganda</li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}