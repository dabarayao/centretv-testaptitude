export const json = {
  title: "Customer Satisfaction Survey",
  showTOC: true,
  progressTitle: "Survey Progress",
  progressBarType: "questions",
  pages: [
    {
      navigationTitle: "Satisfaction",
      navigationDescription: "Your feedback",
      elements: [
        {
          type: "comment",
          name: "suggestions",
          title: "What would make you more satisfied with our product?",
          maxLength: 500,
          isRequired: true
        }
      ]
    },
    {
      navigationTitle: "Pricing",
      navigationDescription: "Your opinion",
      elements: [
        {
          type: "radiogroup",
          name: "price to competitors",
          title: "Compared to our competitors, do you feel our product is",
          choices: [
            "Less expensive",
            "Priced about the same",
            "More expensive",
            "Not sure"
          ]
        },
        {
          type: "radiogroup",
          name: "price",
          title: "Do you feel our current price is merited by our product?",
          choices: [
            "correct|Yes, the price is about right",
            "low|No, the price is too low for your product",
            "high|No, the price is too high for your product"
          ]
        },
        {
          type: "multipletext",
          name: "pricelimit",
          title: "What is the... ",
          items: [
            {
              name: "mostamount",
              title: "Most amount you would every pay for a product like ours"
            },
            {
              name: "leastamount",
              title: "The least amount you would feel comfortable paying"
            }
          ]
        }
      ]
    },
    {
      navigationTitle: "Contacts",
      navigationDescription: "We're in touch",
      elements: [
        {
          type: "text",
          name: "email",
          title:
            "Thank you for taking our survey. Your survey is almost complete, please enter your email address in the box below if you wish to participate in our drawing, then press the 'Submit' button."
        }
      ]
    }
  ]
};
