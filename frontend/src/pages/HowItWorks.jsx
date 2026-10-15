import { Link } from 'react-router-dom';
import { Edit3, Zap, CheckCircle, Shield, Search, ArrowRight, Lock, Bell } from 'lucide-react';

export default function HowItWorks() {
  return (
    <div className="page-container max-w-3xl">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">How FindIt works</h1>
        <p className="text-gray-500 text-lg leading-relaxed">
          A complete guide to reporting, matching, claiming, and recovering lost items.
        </p>
      </div>

      <div className="space-y-10">
        {[
          {
            icon: <Edit3 className="w-5 h-5 text-gray-700" />,
            step: '01', title: 'Submit a detailed report',
            body: `Create an account and go to "Report an item". Fill in the item type (lost or found), title, category, description, approximate location, and date. Upload up to 4 photos — images are used by the AI to improve match quality. The more detail you provide, the better the AI can rank potential matches.`
          },
          {
            icon: <Zap className="w-5 h-5 text-amber-600" />,
            step: '02', title: 'AI-powered matching',
            body: `After you submit a report, FindIt's AI service compares it against all items of the opposite type. It analyses text similarity (title, description, identifying features), image similarity using computer vision, location overlap, and date proximity. Each pair receives an overall similarity score and per-component scores. Scores are a ranking tool — they are clearly labelled as such and do not prove ownership.`
          },
          {
            icon: <Search className="w-5 h-5 text-blue-600" />,
            step: '03', title: 'Browse and review matches',
            body: `Visit your Dashboard and tap the lightning bolt icon on any report to see its AI-ranked potential matches. Each match shows the overall similarity score and a breakdown of text, image, location, and date components. You can dismiss irrelevant matches to keep your list clean.`
          },
          {
            icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
            step: '04', title: 'Submit a claim',
            body: `If you believe a found item belongs to you, open the item detail page and submit a claim. Write a message explaining your ownership and optionally provide private verification details (such as a serial number, receipt number, or unique marking). These details are only visible to the item reporter and site administrators — never to the public.`
          },
          {
            icon: <Shield className="w-5 h-5 text-purple-600" />,
            step: '05', title: 'Verification and approval',
            body: `The item reporter reviews your claim and private verification details privately. They can approve or reject the claim with an optional note. If approved, both parties can see each other's contact information. We recommend meeting in a public place or through a campus security office for the actual handover.`
          },
          {
            icon: <Bell className="w-5 h-5 text-rose-600" />,
            step: '06', title: 'Notifications',
            body: `You receive in-app notifications for every important event: a new match found, a claim received, a claim reviewed, and when an item is marked resolved. Notifications are polled every 30 seconds while you have the app open.`
          },
          {
            icon: <Lock className="w-5 h-5 text-gray-600" />,
            step: '07', title: 'Privacy and safety',
            body: `Contact details (email, phone) are only visible to authenticated users. Private verification answers are never shown publicly. Abuse reports are reviewed by administrators. No financial information is ever collected or required.`
          },
        ].map(({ icon, step, title, body }) => (
          <div key={step} className="flex gap-5">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                {icon}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Step {step}</p>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">{title}</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-gray-900 rounded-2xl p-8 text-center">
        <h3 className="text-lg font-bold text-white mb-2">Ready to get started?</h3>
        <p className="text-gray-400 text-sm mb-5">Create a free account and report or search for items in minutes.</p>
        <div className="flex justify-center gap-3">
          <Link to="/register" className="btn-primary bg-white text-gray-900 hover:bg-gray-100">
            Create account <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/browse" className="btn-secondary border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white">
            Browse items
          </Link>
        </div>
      </div>
    </div>
  );
}
