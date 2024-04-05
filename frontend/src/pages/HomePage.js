import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const HomePage = () => {
    return (
        <div>
            {/* Hero Section */}
            <div className="bg-gray-800 text-white py-20 px-8 md:px-16">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center">
                        Bienvenue sur le site Livre d'Ailleurs
                    </h1>
                    <p className="text-lg md:text-xl mb-8 text-center">
                        Découvrez une nouvelle façon de faire découvrir le monde de la littérature.
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="bg-gray-100 py-20 px-8 md:px-16">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold mb-4 text-center">Découvrez notre plateforme</h2>
                    <p className="text-lg md:text-xl mb-8 text-center">
                        Explorez les fonctionnalités uniques de Livre d'Ailleurs pour enrichir votre expérience de lecture.
                    </p>
                    <p className="text-lg md:text-xl mb-8 text-center">
                    Le projet consiste à créer une application web pour gérer le festival littéraire international "Livres D’ailleurs". Cette application permettra l'inscription et l'authentification des auteurs et des établissements participants, ainsi que la planification automatique des interventions des auteurs dans les établissements. Elle permettra également la soumission de vœux pour les ouvrages à présenter, la génération de statistiques après chaque édition, et la conservation des informations pour les éditions futures.
                    </p>
                </div>
            </div>

            {/* Button Section */}
            <div className="flex flex-col items-center justify-center py-12">
                <h2 className="text-3xl font-semibold mb-6">Qui êtes-vous ?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    <Link to="/commissionscolaire">
                        <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg">
                            Commission Scolaire
                        </button>
                    </Link>
                    <Link to="/auteur">
                        <button className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg">
                            Auteur
                        </button>
                    </Link>
                    <Link to="/etablissement">
                        <button className="w-full bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-4 px-6 rounded-lg">
                            Établissement
                        </button>
                    </Link>
                </div>
            </div>

            {/* Team Section */}
            <div className="bg-gray-200 py-20 px-8 md:px-16">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold mb-4 text-center">Notre équipe</h2>
                    <p className="text-lg md:text-xl mb-8 text-center">
                        Rencontrez les personnes passionnées qui rendent Livre d'Ailleurs possible.
                    </p>
                    <ul className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
                        <li className="mb-8 flex flex-col items-center">
                            <p className="text-lg font-bold mb-2">Hugo Walter</p>
                        </li>
                        <li className="mb-8 flex flex-col items-center">
                            <p className="text-lg font-bold mb-2">Célestin Sebti</p>
                        </li>
                        <li className="mb-8 flex flex-col items-center">
                            <p className="text-lg font-bold mb-2">Gael Balloir</p>
                        </li>
                        <li className="mb-8 flex flex-col items-center">
                            <p className="text-lg font-bold mb-2">Antoine Hubert</p>
                        </li>
                        <li className="mb-8 flex flex-col items-center">
                            <p className="text-lg font-bold mb-2">Tom Ciapa</p>
                        </li>
                    </ul>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default HomePage;
