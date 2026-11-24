import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Leaf, Globe, HeartHandshake, ArrowRight, Award } from 'lucide-react';

const About = () => {
  return (
    <div className="w-full bg-background min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 lg:px-8 space-y-16">
        {/* Editorial Hero Statement */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="font-label-sm text-label-sm uppercase tracking-[0.25em] text-primary text-xs font-semibold">
            The Atelier Manifesto
          </span>
          <h1 className="font-display-lg text-display-lg-mobile lg:text-display-lg text-on-surface leading-tight">
            Quiet Luxury Reimagined for the Modern Collector
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
            NOVARA embodies the understated elegance of a heritage European department store, thoughtfully reimagined as an effortless digital flagship for conscious, intentional living.
          </p>
        </div>

        {/* Large Editorial Imagery Section */}
        <div className="relative rounded-2xl overflow-hidden aspect-[16/9] shadow-xl border border-surface-container-high">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjcrsNEdzF7V_vBKZ-aEXokMYsrQq7ifG_q6wUhWx9jn5LEJonOyKhoRTqKhGtEYDWdlHpGQ7AwPshyCI3Z6rtkuMjisC3xlvl9O_IDJPmUTZ3R9VG5jyZvOzN1vL7i2ut4YJTWl9qEVMlruTbRecgJXz6N4pxczMRQvlkW36C_qffKb__sStk7AP4cLNFDovrtgp4JgC-_V4cgAsuJEi1FEJWcFWp-YU4lAtXqbdb" 
            alt="NOVARA Atelier Studio"
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-on-surface/75 via-transparent to-transparent flex items-end p-8 sm:p-12">
            <div className="text-on-primary max-w-xl">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary-fixed block mb-1 text-xs">
                Heritage & Provenance
              </span>
              <h2 className="font-headline-lg text-headline-lg font-medium text-surface">
                Crafted in Serenity, Bound by Integrity
              </h2>
            </div>
          </div>
        </div>

        {/* Three Core Stylistic Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-surface-container-lowest p-8 rounded-xl border border-surface-container-high shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
              <Leaf className="w-5 h-5" />
            </div>
            <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface">Quiet Warmth</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed text-xs">
              Sterile whites are replaced with warm alabaster, oatmeal cashmere, and softened champagne layers that soothe the senses and welcome contemplation.
            </p>
          </div>

          <div className="bg-surface-container-lowest p-8 rounded-xl border border-surface-container-high shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface">Editorial Discipline</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed text-xs">
              We juxtapose sweeping transitional serif titles with structured, highly legible minimalist UI, ensuring that every product feels framed as an archival collectible.
            </p>
          </div>

          <div className="bg-surface-container-lowest p-8 rounded-xl border border-surface-container-high shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface">Restrained Tactility</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed text-xs">
              Architectural negative space, micro-hairlines, and diffused ambient warmth allow pure materials—from unbleached linen to Tivoli travertine—to take center stage.
            </p>
          </div>
        </div>

        {/* Master Artisan Guilds */}
        <div className="bg-surface-container-low p-8 sm:p-12 rounded-2xl border border-surface-container-high space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-primary text-xs font-semibold">
              The Artisan Guild
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mt-1">
              Conscious Production Partners
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant text-xs mt-2">
              Every creation is signed and numbered by European family workshops operating across multi-generational legacies.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-surface-container-high">
              <span className="font-label-sm text-[10px] text-tertiary uppercase font-bold tracking-wider">Biella, Italy</span>
              <h4 className="font-headline-sm font-semibold text-on-surface mt-1">Cashmere & Wool Guild</h4>
              <p className="font-body-sm text-on-surface-variant text-xs mt-2">
                12-gauge combed cashmere spun using Alpine glacier water filtration.
              </p>
            </div>

            <div className="bg-surface-container-lowest p-6 rounded-xl border border-surface-container-high">
              <span className="font-label-sm text-[10px] text-tertiary uppercase font-bold tracking-wider">Normandy, France</span>
              <h4 className="font-headline-sm font-semibold text-on-surface mt-1">Long-Staple Flax Mill</h4>
              <p className="font-body-sm text-on-surface-variant text-xs mt-2">
                Rain-fed certified European flax stone-washed without caustic bleaches.
              </p>
            </div>

            <div className="bg-surface-container-lowest p-6 rounded-xl border border-surface-container-high">
              <span className="font-label-sm text-[10px] text-tertiary uppercase font-bold tracking-wider">Tivoli, Italy</span>
              <h4 className="font-headline-sm font-semibold text-on-surface mt-1">Roman Travertine Masonry</h4>
              <p className="font-body-sm text-on-surface-variant text-xs mt-2">
                Hand-hewn natural stone carved into sculptural vessels and catchalls.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <Link 
            to="/shop" 
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-on-surface text-surface font-label-lg text-label-lg uppercase tracking-wider font-semibold hover:bg-primary transition-colors shadow-md text-xs"
          >
            <span>Explore The Current Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
