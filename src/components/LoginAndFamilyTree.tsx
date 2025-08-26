import React, { useState } from 'react';
import { PreferedFamilyTreeSlider } from './666PreferedFamilyTreeSlider';

export function LoginAndFamilyTree() {
  const [idNumber, setIdNumber] = useState('');
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (idNumber.trim()) {
      setSubmittedId(idNumber.trim());
    }
  };

  if (submittedId) {
    return <PreferedFamilyTreeSlider personId={submittedId} componentName="PreferedFamilyTreeSlider" eventName="IdSubmitted"/>;
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-6 rounded shadow">
        <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700 mb-2">
          Enter your ID Number
        </label>
        <input
          type="text"
          id="idNumber"
          value={idNumber}
          onChange={e => setIdNumber(e.target.value)}
          placeholder="ID Number"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        />
        <button
          type="submit"
          className="w-full bg-pink-600 text-white py-2 rounded hover:bg-grey-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
