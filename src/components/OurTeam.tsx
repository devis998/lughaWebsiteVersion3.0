import { useState } from 'react';
import { Languages, Linkedin, Twitter, Mail, ChevronDown } from 'lucide-react';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  photo: string;
  languages?: string[];
  linkedin?: string;
  twitter?: string;
  email?: string;
  level: number;
}

const teamData: TeamMember[] = [
  {
    id: 1,
    name: 'Devis M',
    role: 'Founder & Lead Translator',
    bio: 'Passionate about breaking language barriers across Africa and beyond. With over 5 years of professional translation management experience, Devis founded Lugha to connect cultures through the power of language.',
    photo: '/Founder.jpg',
    languages: ['Swahili', 'English',],
    linkedin: '#',
    twitter: '#',
    email: 'mwombekidevis@gmail.com',
    level: 1,
  },
  {
    id: 2,
    name: 'Kofi Asante',
    role: 'Head of Translation & Linguistics',
    bio: 'Linguistic scholar and certified translator with deep expertise in West African languages. Kofi oversees translation quality and linguistic integrity across all Lugha projects.',
    photo: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400',
    languages: ['Twi', 'Hausa', 'English', 'French'],
    linkedin: '#',
    twitter: '#',
    email: 'kofi@lugha.com',
    level: 2,
  },
  {
    id: 3,
    name: 'Elias Mateko',
    role: 'Operations & Project Manager',
    bio: 'Expert in coordinating complex multilingual projects. Elias ensures every client deliverable is on time, within scope, and exceeds quality expectations.',
    photo: '/Elias Mateko.jpeg',
    languages: ['Swahili', 'English'],
    linkedin: '#',
    email: 'elias@getlugha.com',
    level: 2,
  },
  {
    id: 4,
    name: 'Tendai Moyo',
    role: 'Head of Localization & Culture',
    bio: 'Cultural consultant and localization strategist who ensures content resonates authentically with target communities. Tendai bridges the gap between translation and cultural nuance.',
    photo: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400',
    languages: ['Shona', 'Ndebele', 'English', 'Zulu'],
    linkedin: '#',
    twitter: '#',
    email: 'tendai@lugha.com',
    level: 2,
  },
  {
    id: 5,
    name: 'Jeph',
    role: 'Senior Translator — Swahili & Somali',
    bio: 'Native Swahili speaker with specialization in legal and medical translation. Yusuf brings precision and cultural depth to every document he touches.',
    photo: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    languages: ['Kinyarwanda', 'English', 'Arabic', 'English'],
    linkedin: '#',
    level: 3,
  },
  {
    id: 6,
    name: 'Adaeze Okafor',
    role: 'Content Specialist & Translator',
    bio: 'Creative writer and translator specializing in marketing and digital content localization. Adaeze crafts messages that connect across Igbo, Yoruba, and English markets.',
    photo: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=400',
    languages: ['Igbo', 'Yoruba', 'English'],
    linkedin: '#',
    twitter: '#',
    level: 3,
  },
  {
    id: 7,
    name: 'Rania Benali',
    role: 'Translator — Arabic & Amazigh',
    bio: 'Specialized in North African languages and dialects, Rania handles technical and academic translations with exceptional accuracy and cultural sensitivity.',
    photo: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400',
    languages: ['Arabic', 'Amazigh', 'French', 'English'],
    linkedin: '#',
    level: 3,
  },
  {
    id: 8,
    name: 'Kwame Adjei',
    role: 'Localization Engineer',
    bio: "Tech-savvy language professional who builds the tools and workflows that power Lugha's translation pipeline. Kwame ensures seamless integration of translations into digital products.",
    photo: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=400',
    languages: ['English', 'Twi', 'French'],
    linkedin: '#',
    twitter: '#',
    level: 3,
  },
  {
    id: 9,
    name: 'Ngozi Eze',
    role: 'Community & Partnerships Manager',
    bio: "Builds and nurtures Lugha's network of translators, clients, and community partners. Ngozi is the voice of Lugha across social channels and professional communities.",
    photo: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400',
    languages: ['English', 'Igbo', 'French'],
    linkedin: '#',
    twitter: '#',
    level: 3,
  },
];

function MemberCard({ member, featured = false }: { member: TeamMember; featured?: boolean }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
        featured ? 'border-2 border-accent-500' : 'border border-gray-100'
      }`}
    >
      {featured && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-400 to-accent-600 z-10" />
      )}

      <div className={`relative overflow-hidden ${featured ? 'h-64' : 'h-40'}`}>
        <img
          src={member.photo}
          alt={member.name}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/85 via-primary-900/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className={`font-bold text-white leading-tight ${featured ? 'text-2xl' : 'text-base'}`}>
            {member.name}
            <sub className="text-primary-500 text-sm">•</sub>
          </h3>
          <p className={`text-accent-300 font-medium mt-0.5 ${featured ? 'text-sm' : 'text-xs'}`}>
            {member.role}
          </p>
        </div>
      </div>

      <div className="p-4">
        <p
          className={`text-gray-600 text-sm leading-relaxed transition-all duration-300 ${
            expanded ? '' : 'line-clamp-3'
          }`}
        >
          {member.bio}
        </p>
        {member.bio.length > 100 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-accent-600 text-xs font-medium mt-2 hover:text-accent-800 transition-colors"
          >
            {expanded ? 'Show less' : 'Read more'}
            <ChevronDown
              className={`w-3 h-3 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
            />
          </button>
        )}

        {member.languages && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {member.languages.map((lang) => (
              <span
                key={lang}
                className="inline-flex items-center gap-1 bg-primary-50 text-primary-700 text-xs font-medium px-2.5 py-0.5 rounded-full border border-primary-100"
              >
                <Languages className="w-3 h-3" />
                {lang}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-3">
          {member.email && (
            <a
              href={`mailto:${member.email}`}
              className="text-gray-400 hover:text-accent-500 transition-colors"
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          )}
          {member.linkedin && (
            <a
              href={member.linkedin}
              className="text-gray-400 hover:text-primary-500 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          )}
          {member.twitter && (
            <a
              href={member.twitter}
              className="text-gray-400 hover:text-primary-500 transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function LevelLabel({ label, color }: { label: string; color: 'primary' | 'accent' | 'neutral' }) {
  const styles = {
    primary: 'bg-primary-100 text-primary-600 border-primary-200',
    accent: 'bg-accent-50 text-accent-700 border-accent-100',
    neutral: 'bg-gray-100 text-gray-600 border-gray-200',
  };
  return (
    <div className="text-center mb-8">
      <span
        className={`inline-block text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full border ${styles[color]}`}
      >
        {label}
      </span>
    </div>
  );
}

export default function OurTeam() {
  const level1 = teamData.filter((m) => m.level === 1);
  const level2 = teamData.filter((m) => m.level === 2);
  const level3 = teamData.filter((m) => m.level === 3);

  return (
    <section id="our-team" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary-100 px-4 py-2 rounded-full mb-4">
            <span className="text-primary-700 font-medium text-sm">Our People</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Meet the Lugha Team
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We are a passionate collective of linguists, translators, and cultural experts united by
            one mission — making every language accessible, every voice heard.
          </p>
        </div>

        {/* ── Level 1: Founder ── */}
        <div className="mb-16">
          <LevelLabel label="Founder" color="primary" />
          <div className="flex justify-center">
            <div className="w-full max-w-xs">
              {level1.map((member) => (
                <MemberCard key={member.id} member={member} featured />
              ))}
            </div>
          </div>
        </div>

        {/* Connector: L1 → L2 */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-px h-8 bg-gradient-to-b from-accent-400 to-primary-300" />
          <div className="w-2/3 max-w-lg h-px bg-primary-200" />
          <div className="flex w-2/3 max-w-lg justify-around">
            {level2.map((m) => (
              <div key={m.id} className="w-px h-8 bg-primary-200" />
            ))}
          </div>
        </div>

        {/* ── Level 2: Management ── */}
        <div className="mb-16">
          <LevelLabel label="Management" color="accent" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {level2.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        </div>

        {/* Connector: L2 → L3 */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-px h-8 bg-gradient-to-b from-primary-300 to-primary-200" />
          <div className="w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-primary-200 to-transparent" />
          <div className="w-px h-6 bg-primary-200" />
        </div>

        {/* ── Level 3: Core Team ── */}
        <div>
          <LevelLabel label="Core Team" color="neutral" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {level3.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        </div>

        {/* Join CTA */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Join the Lugha Family
          </h3>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto mb-6">
            Are you a skilled translator or linguist passionate about African languages? We are always
            looking for talented people to grow our team.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="mailto:careers@lugha.com"
              className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
            >
              <Mail className="w-4 h-4" />
              View Open Positions
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
