export default function Privacy() {
  return (
    <div className="page-container max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-400 mb-10">Last updated: {new Date().getFullYear()}</p>

      <div className="prose prose-sm max-w-none space-y-8 text-gray-600">
        {[
          {
            title: 'What we collect',
            body: 'When you create an account we collect your name, email address, and optionally your phone number. When you report an item we collect the item details, photos, and approximate location you provide. We do not collect payment information.',
          },
          {
            title: 'How we use your data',
            body: 'Your data is used to operate the FindIt platform: displaying item listings, running AI similarity analysis, facilitating ownership claims, and sending in-app notifications. We do not sell your data to third parties.',
          },
          {
            title: 'Contact information visibility',
            body: 'Your email and phone number are only visible to authenticated users when viewing item details. Private verification answers submitted with a claim are only visible to the item reporter and platform administrators.',
          },
          {
            title: 'AI and image processing',
            body: 'Photos you upload may be processed by an AI model to generate image embeddings for similarity matching. Embeddings are mathematical representations; the original images are not shared with third parties. AI scores are used only as a ranking tool and do not prove ownership.',
          },
          {
            title: 'Image storage',
            body: 'If Cloudinary is configured, images are stored on Cloudinary\'s servers. Otherwise they are stored on the local server. Images may be deleted when an item is deleted.',
          },
          {
            title: 'Data retention',
            body: 'Your account and associated reports remain active until you request deletion. You may delete individual reports from your dashboard at any time.',
          },
          {
            title: 'Security',
            body: 'Passwords are hashed using bcrypt and are never stored in plain text. Authentication uses short-lived JWT tokens. Rate limits are applied to authentication and claim endpoints to prevent abuse.',
          },
          {
            title: 'Contact',
            body: 'If you have questions about this policy or wish to request data deletion, please use the report abuse feature or contact the platform administrator.',
          },
        ].map(({ title, body }) => (
          <div key={title}>
            <h2 className="text-base font-semibold text-gray-900 mb-2">{title}</h2>
            <p className="text-sm leading-relaxed">{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
