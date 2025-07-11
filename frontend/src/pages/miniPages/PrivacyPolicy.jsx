import React from 'react'

const PrivacyPolicy = () => {
  return (
    <section className="container mx-auto px-6 py-16 max-w-4xl text-gray-800">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-700">Privacy Policy</h1>
      
      <p className="mb-4">
        At Combat Corner Bangladesh, your privacy is important to us. This privacy policy explains
        how we collect, use, and protect your personal information when you use our website.
      </p>

      <h2 className="text-2xl font-semibold mb-4 mt-6">Information We Collect</h2>
      <p className="mb-4">
        We may collect information you provide directly, such as your name and email address when
        you subscribe to newsletters or post comments.
      </p>

      <h2 className="text-2xl font-semibold mb-4 mt-6">How We Use Your Information</h2>
      <p className="mb-4">
        Your information helps us improve our content, respond to your inquiries, and personalize
        your experience. We do not sell or share your personal data with third parties without
        your consent.
      </p>

      <h2 className="text-2xl font-semibold mb-4 mt-6">Cookies</h2>
      <p className="mb-4">
        Our website uses cookies to enhance user experience. You can control cookies through your
        browser settings.
      </p>

      <h2 className="text-2xl font-semibold mb-4 mt-6">Contact Us</h2>
      <p>
        If you have questions about this privacy policy, please contact us at
        <a href="mailto:contact@combatcornerbd.com" className="text-blue-600 underline ml-1">
          contact@combatcornerbd.com
        </a>.
      </p>
    </section>
  )
}

export default PrivacyPolicy
