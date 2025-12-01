import React, { useState } from 'react';
import api from "../api";

function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    api.post('/feedback', { name, email, message })
      .then(() => {
        setSubmitted(true);
        setName('');
        setEmail('');
        setMessage('');
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="min-h-[calc(100vh-60px)] bg-gray-50 p-6 flex justify-center items-start pt-10">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">

        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Contact Us</h2>

        {submitted ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-center mb-4">
            <p className="font-bold">Thank you!</p>
            <p>Your message has been sent.</p>
            <button onClick={() => setSubmitted(false)} className="text-xs underline mt-2">Send another</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input type="text" className="border p-2" placeholder="Your Name"
              value={name} onChange={e => setName(e.target.value)} required />

            <input type="email" className="border p-2" placeholder="Email"
              value={email} onChange={e => setEmail(e.target.value)} required />

            <textarea rows="4" className="border p-2" placeholder="Message"
              value={message} onChange={e => setMessage(e.target.value)} required />

            <button className="bg-gray-900 text-white p-2 rounded">Send</button>
          </form>
        )}

      </div>
    </div>
  );
}

export default Contact;
