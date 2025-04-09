import React from 'react';
import { FaqItem } from '../../types';

interface Props {
  faqs: FaqItem[];
}

export function FaqSection({ faqs }: Props): JSX.Element {
  return (
    <div className="mt-6 space-y-4">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Perguntas Frequentes</h2>
      {faqs.map((item, index) => (
        <details
          key={index}
          className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition-shadow group"
        >
          <summary className="text-lg font-semibold cursor-pointer list-none flex justify-between items-center">
            {item.question}
            <span className="material-symbols-outlined transition-transform duration-300 group-open:rotate-180">
              expand_more
            </span>
          </summary>
          <div className="mt-2 pt-2 border-t border-gray-200">
            <p className="text-gray-600">{item.answer}</p>
          </div>
        </details>
      ))}
    </div>
  );
}