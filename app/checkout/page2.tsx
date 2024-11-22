// app/checkout/page.tsx
'use client'

import { useState } from 'react'
//import { useCart } from '@/contexts/CartContext'
//import { Button } from '@/components/ui/button'
import { ShippingForm } from '@/components/checkout/ShippingForm'
import { PaymentForm } from '@/components/checkout/PaymentForm'
//import { OrderSummary } from '@/components/checkout/OrderSummary'

export default function CheckoutPage() {
  const [step, setStep] = useState(1)
  //const { items } = useCart()

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="flex justify-between mb-8">
        <div className={`font-semibold ${step === 1 ? 'text-primary' : 'text-gray-400'}`}>Shipping</div>
        <div className={`font-semibold ${step === 2 ? 'text-primary' : 'text-gray-400'}`}>Payment</div>
        <div className={`font-semibold ${step === 3 ? 'text-primary' : 'text-gray-400'}`}>Review</div>
      </div>
      {step === 1 && <ShippingForm onNext={nextStep} />}
      {step === 2 && <PaymentForm onNext={nextStep} onPrev={prevStep} />}
      {/* {step === 3 && <OrderSummary items={items} onPrev={prevStep} />} */}
    </div>
  )
}