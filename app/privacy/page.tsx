import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function PrivacyPolicyPage() {
  const policies = [
    {
      title: "Information We Collect",
      content: "We collect personal information such as your name, email address, phone number, and physical address when you create an account or place an order. We also collect information about your vehicle when you use our 'Shop by Car' feature. In compliance with the Data Protection and Privacy Act 2019 of Uganda, we ensure that all personal data is collected and processed fairly and lawfully."
    },
    {
      title: "How We Use Your Information",
      content: "We use your information to process orders, provide customer support, and improve our services. We may also use your information to send you promotional offers and updates about our products, but you can opt out of these communications at any time. We do not sell your personal information to third parties."
    },
    {
      title: "Data Security",
      content: "We implement a variety of security measures to maintain the safety of your personal information. All payment transactions are encrypted using SSL technology. We regularly update our security measures to comply with Ugandan data protection laws and international best practices."
    },
    {
      title: "Cookies and Tracking Technologies",
      content: "We use cookies and similar tracking technologies to enhance your browsing experience on our website. You can choose to disable cookies through your browser settings, but this may affect some features of our website."
    },
    {
      title: "Third-Party Services",
      content: "We may use third-party services, such as payment processors and shipping companies, to fulfill your orders. These services have access to your personal information only to perform specific tasks on our behalf and are obligated not to disclose or use it for any other purpose."
    },
    {
      title: "Your Rights",
      content: "Under Ugandan law, you have the right to access, correct, or delete your personal information. You can exercise these rights by contacting our customer support team. We will respond to your request within the timeframe specified by Ugandan data protection regulations."
    },
    {
      title: "Changes to This Policy",
      content: "We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the 'last updated' date."
    },
    {
      title: "Contact Us",
      content: "If you have any questions about this privacy policy, please contact us at privacy@kamboautos.com or visit our physical office in Kampala."
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Last updated: {new Date().toLocaleDateString('en-UG', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <p className="mb-6">
            At Kambo Autos, we are committed to protecting your privacy and ensuring the security of your personal information. This privacy policy explains how we collect, use, and safeguard your data when you use our website and services.
          </p>
          <Accordion type="single" collapsible className="w-full">
            {policies.map((policy, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{policy.title}</AccordionTrigger>
                <AccordionContent>{policy.content}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}