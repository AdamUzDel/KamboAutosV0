import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function TermsOfServicePage() {
  const terms = [
    {
      title: "Acceptance of Terms",
      content: "By accessing or using the Kambo Autos website and services, you agree to be bound by these Terms of Service and all applicable laws and regulations of Uganda. If you do not agree with any part of these terms, you may not use our services."
    },
    {
      title: "Use of Our Services",
      content: "You may use our services only for lawful purposes and in accordance with these Terms. You agree not to use our services in any way that violates any applicable Ugandan or international law or regulation."
    },
    {
      title: "User Accounts",
      content: "When you create an account with us, you must provide accurate and complete information. You are solely responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account."
    },
    {
      title: "Product Information and Pricing",
      content: "We strive to provide accurate product information and pricing. However, in the event of an error, we reserve the right to correct such error and revise your order accordingly or to cancel the order and refund any amount charged."
    },
    {
      title: "Intellectual Property",
      content: "The content on the Kambo Autos website, including text, graphics, logos, and images, is the property of Kambo Autos and is protected by Ugandan and international copyright laws."
    },
    {
      title: "Limitation of Liability",
      content: "Kambo Autos shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of our services. Our liability is limited to the maximum extent permitted by Ugandan law."
    },
    {
      title: "Governing Law",
      content: "These Terms shall be governed by and construed in accordance with the laws of Uganda. Any disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of Uganda."
    },
    {
      title: "Changes to Terms",
      content: "We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on this page and updating the 'last updated' date."
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Terms of Service</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Last updated: {new Date().toLocaleDateString('en-UG', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <p className="mb-6">
            Welcome to Kambo Autos. These Terms of Service govern your use of our website and services. Please read these terms carefully before using our platform.
          </p>
          <Accordion type="single" collapsible className="w-full">
            {terms.map((term, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{term.title}</AccordionTrigger>
                <AccordionContent>{term.content}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}