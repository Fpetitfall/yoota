import React from "react";
import Link from "next/link";
import { Globe, Share2, Mail, ExternalLink } from "lucide-react";

const Footer = () => {
  const footerLinks = [
    {
      title: "RESSOURCES",
      links: [
        "Trouver un magasin",
        "Devenir membre",
        "Cartes cadeaux",
      ],
    },
    {
      title: "AIDE",
      links: [
        "Livraison",
        "Retours",
        "Nous contacter",
      ],
    },
  ];

  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 text-center max-w-4xl mx-auto">
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="font-bold text-sm mb-6 uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-secondary hover:text-white transition-colors text-sm"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="flex flex-col items-center">
            <h3 className="font-bold text-sm mb-6 uppercase tracking-wider">
              REJOIGNEZ-NOUS
            </h3>
            <div className="flex space-x-4">
              <Link href="#" className="p-2 bg-secondary/30 rounded-full hover:bg-secondary/50 transition-colors">
                <Globe className="w-5 h-5" />
              </Link>
              <Link href="#" className="p-2 bg-secondary/30 rounded-full hover:bg-secondary/50 transition-colors">
                <Share2 className="w-5 h-5" />
              </Link>
              <Link href="#" className="p-2 bg-secondary/30 rounded-full hover:bg-secondary/50 transition-colors">
                <Mail className="w-5 h-5" />
              </Link>
              <Link href="#" className="p-2 bg-secondary/30 rounded-full hover:bg-secondary/50 transition-colors">
                <ExternalLink className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-secondary/20 pt-8 flex flex-col items-center text-center text-[12px] text-secondary">
          <div className="flex flex-col items-center space-y-2 mb-6">
            <span className="text-white font-medium">France</span>
            <span>© 2024 Nike, Inc. Tous droits réservés</span>
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            <Link href="#" className="hover:text-white transition-colors">Conditions d'utilisation</Link>
            <Link href="#" className="hover:text-white transition-colors">Politique de confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
