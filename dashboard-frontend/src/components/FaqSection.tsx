import React from 'react'

interface Faq {
  question: string
  answer: string
}

interface Props {
  faqs: Faq[]
}

export function FaqSection({ faqs }: Props) {
  return (
    <div className="mt-6 space-y-4">
      {faqs.map((item, index) => (
        <details
          key={index}
          className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition-shadow"
        >
          <summary className="text-lg font-semibold cursor-pointer">
            {item.question}
          </summary>
          <p className="mt-2 p-4 bg-gray-50 rounded-lg">{item.answer}</p>
        </details>
      ))}
    </div>
  )
}
