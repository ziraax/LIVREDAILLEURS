import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';


const Contact = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Code pour envoyer l'e-mail
    setSubmitted(true);
  };

  return (
    <><Navbar /><div className="container mx-auto flex justify-center items-center h-screen">
          <div className="max-w-md w-full bg-white p-8 rounded-md shadow-md">
              <h1 className="text-3xl font-bold mb-4">Contactez-nous</h1>
              <form onSubmit={handleSubmit} className="mb-4">
                  <div className="mb-4">
                      <label htmlFor="email" className="block mb-2">Votre adresse e-mail :</label>
                      <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
                          required />
                  </div>
                  <div className="mb-4">
                      <label htmlFor="message" className="block mb-2">Votre message :</label>
                      <textarea
                          id="message"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="w-full border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
                          rows="4"
                          required
                      ></textarea>
                  </div>
                  <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Envoyer</button>
              </form>
              {submitted && (
                  <p className="mt-4 text-green-600">Votre message a été envoyé avec succès !</p>
              )}
          </div>

      </div>
      <Footer />
      </>
  );
};

export default Contact;
