import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
const AboutPage = () => {
  return (
    <><Navbar /><div className="max-w-4xl mx-auto px-4 py-8">
          <section className="mb-8">
              <h2 className="text-3xl font-semibold mb-4">Notre Objectif</h2>
              <p className="text-lg leading-relaxed">
                  L’objectif du projet est de réaliser un système d’information sous forme d’une application web permettant l’organisation et la gestion du festival littéraire international "Livres D’ailleurs". Ce système d’information a pour objectif la gestion et le stockage des différentes données nécessaires à la planification automatique des interventions des auteurs participants dans différents établissements pour chaque édition du festival.
              </p>
              <p className="text-lg leading-relaxed mt-4">
                  Il devra présenter une interface web permettant l’inscription et l’authentification des auteurs et établissements concernés afin qu’ils puissent réaliser facilement différentes actions tout au long du processus (se référer aux fonctionnalités énumérées plus bas). Il devra, pour chaque édition, mettre en place une campagne de vœux afin de permettre aux établissements de choisir parmi une sélection d’ouvrages, portant sur un thème donné, selon un principe de priorité des vœux, et de fournir pour chaque vœu, les coordonnées d’un référent d’établissement.
              </p>
              <p className="text-lg leading-relaxed mt-4">
                  Il devra être capable, après une campagne de vœux, de planifier algorithmiquement les interventions des auteurs selon différentes contraintes dont la priorité des vœux et la localisation des établissements. Pour chaque intervention devront être fournies les coordonnées d’un accompagnateur et si besoin d’un interprète. Il devra, à la fin de chaque édition, générer des statistiques sur l’édition qui a eu lieu ainsi que garder en mémoire les informations sur les auteurs, établissements, référents, accompagnateurs et interprètes pour des prochaines éditions.
              </p>
              <p className="text-lg leading-relaxed mt-4">
                  Dans cet intérêt ce rapport présentera la première étape conceptuelle du système d’information afin de vérifier si l’implémentation prévue est en accord avec la demande initiale. Seront présentés les différents acteurs du système prévus, une retranscription de la demande via la liste des différentes règles de gestion prévues et la liste des différentes fonctionnalités qui en découlent, ainsi qu’une première version de la structure de la base de données (sous forme d’un diagramme de classe UML).
              </p>
          </section>

          <section className="mb-8">
              <h2 className="text-3xl font-semibold mb-4">Nos rapports</h2>
              <div className="grid grid-cols-2 gap-4">
                  <a href="/pdfs/Etape1_Rapport_CSI_SEBTI_Celestin_WALTER_Hugo_HUBERT_Antoine_BALLOIR_Gael_CIAPA_Tom.pdf" download className="bg-gray-200 p-4 rounded-lg text-center">
                      <span className="text-lg">Telecharger rapport PDF Rendu n°1</span>
                  </a>
                  <a href="/pdfs/Etape2_Rapport_CSI_SEBTI_Celestin_WALTER_Hugo_HUBERT_Antoine_BALLOIR_Gael_CIAPA_Tom.pdf" download className="bg-gray-200 p-4 rounded-lg text-center">
                      <span className="text-lg">Telecharger rapport PDF Rendu n°2</span>
                  </a>
              </div>
          </section>

          <section className="mb-8">
              <h2 className="text-3xl font-semibold mb-4">Notre Équipe</h2>
              <p className="text-lg leading-relaxed">
                  Rencontrez les personnes passionnées qui rendent Livre d'Ailleurs possible.
              </p>
              <ul className="flex flex-wrap justify-center gap-6 mt-4">
                  <li className="flex flex-col items-center">
                      <p className="text-lg font-bold mb-2">Célestin Sebti</p>
                  </li>
                  <li className="flex flex-col items-center">
                      <p className="text-lg font-bold mb-2">Hugo Walter</p>
                  </li>
                  <li className="flex flex-col items-center">
                      <p className="text-lg font-bold mb-2">Gael Balloir</p>
                  </li>
                  <li className="flex flex-col items-center">
                      <p className="text-lg font-bold mb-2">Antoine Hubert</p>
                  </li>
                  <li className="flex flex-col items-center">
                      <p className="text-lg font-bold mb-2">Tom Ciapa</p>
                  </li>
              </ul>
          </section>
      </div>
      <Footer />
      </>
  );
};

export default AboutPage;
