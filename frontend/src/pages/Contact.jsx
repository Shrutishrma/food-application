import React, { useState } from 'react';
import axios from 'axios';

function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Send data to backend
    axios.post('http://localhost:8081/feedback', { name, email, message })
      .then(res => {
        // Show success message
        setSubmitted(true);
        // Reset form
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
        <p className="text-sm text-gray-500 text-center mb-6">We'd love to hear your feedback!</p>
        
        {/* SUCCESS MESSAGE */}
        {submitted ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-center mb-4">
            <p className="font-bold">Thank you!</p>
            <p className="text-sm">Your message has been sent successfully.</p>
            <button onClick={() => setSubmitted(false)} className="text-xs underline mt-2 text-green-800">Send another</button>
          </div>
        ) : (
          /* FORM */
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Your Name</label>
              <input type="text" className="w-full border p-2 rounded text-sm bg-gray-50 focus:outline-orange-500" 
                placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Email</label>
              <input type="email" className="w-full border p-2 rounded text-sm bg-gray-50 focus:outline-orange-500" 
                placeholder="john@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Message</label>
              <textarea className="w-full border p-2 rounded text-sm bg-gray-50 focus:outline-orange-500" 
                rows="4" placeholder="Type your message here..." value={message} onChange={e => setMessage(e.target.value)} required></textarea>
            </div>
            
            <button className="bg-gray-900 text-white font-bold py-2 rounded text-sm hover:bg-gray-800 transition shadow-lg">
              Send Message
            </button>
          </form>
        )}

      </div>
    </div>
  );
}

export default Contact;