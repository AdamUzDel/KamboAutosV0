import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function ShippingPolicyPage() {
  const policies = [
    {
      title: "Domestic Shipping within Uganda",
      content: "We offer free standard shipping on all orders over 200,000 UGX within Uganda. For orders below this amount, a flat rate of 15,000 UGX applies. Standard shipping typically takes 2-5 business days, depending on your location within the country. We also offer express shipping options for an additional fee, which can deliver your order within 1-2 business days in major cities like Kampala, Entebbe, and Jinja."
    },
    {
      title: "International Shipping",
      content: "We currently offer shipping to select countries in East Africa, including Kenya, Tanzania, Rwanda, and Burundi. International shipping rates and delivery times vary depending on the destination. Please note that customers are responsible for any customs duties or import taxes that may apply in their country."
    },
    {
      title: "Shipping Methods",
      content: "We partner with reputable courier services in Uganda, such as DHL and Aramex, to ensure safe and timely delivery of your orders. For domestic shipments, we also utilize local courier services that have extensive coverage across Uganda."
    },
    {
      title: "Order Processing Time",
      content: "Most orders are processed and shipped within 1-2 business days. However, during peak seasons or promotional periods, processing times may be slightly longer. We will notify you via email if there are any unexpected delays in processing your order."
    },
    {
      title: "Tracking Your Order",
      content: "Once your order is shipped, you will receive a confirmation email with a tracking number. You can use this number to track your package on our website or the courier's website. For orders within Kampala, we also offer real-time tracking through our mobile app."
    },
    {
      title: "Delivery to Remote Areas",
      content: "For deliveries to remote areas of Uganda, additional shipping time and costs may apply. We strive to reach all areas of the country, but some extremely remote locations may require special arrangements. Please contact our customer service for more information if you're located in a remote area."
    },
    {
      title: "Lost or Damaged Packages",
      content: "In the rare event that your package is lost or damaged during shipping, please contact our customer service immediately. We will work with our shipping partners to locate your package or process a replacement order as quickly as possible."
    },
    {
      title: "Changes to Shipping Policy",
      content: "We reserve the right to modify our shipping policy at any time. Any changes will be reflected on this page, and we encourage you to check back periodically for updates."
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Shipping Policy</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Last updated: {new Date().toLocaleDateString('en-UG', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <p className="mb-6">
            At Kambo Autos, we strive to provide fast, reliable, and affordable shipping options for our customers in Uganda and across East Africa. This shipping policy outlines our practices to ensure you have a smooth experience when receiving your auto parts.
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