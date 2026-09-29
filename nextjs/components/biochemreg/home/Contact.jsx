"use client";

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

const Contact = () => {
    const { t } = useLanguage();

    const contactInfo = [
        { label: t("contact.labels.email", "Email"), value: t("contact.values.email", "lab@biomaterials.hacettepe.edu.tr") },
        { label: t("contact.labels.address", "Address"), value: t("contact.values.address", "Department of Chemical Engineering, Hacettepe University, Beytepe, Ankara") },
        { label: t("contact.labels.phone", "Phone"), value: t("contact.values.phone", "+90 312 000 00 00") }
    ];

    return (
        <section id="contact" className="max-w-7xl mx-auto px-6 lg:px-10 py-24 border-t border-border">
            <p className="font-serif italic text-muted-foreground text-[0.95rem] mb-3">
                {t("contact.vol", "Vol. VII — Contact")}
            </p>
            
            <div className="grid lg:grid-cols-2 gap-16">
                {/* Sol: Bilgi */}
                <div>
                    <h2 className="font-heading text-4xl text-foreground tracking-tight mb-6">
                        {t("contact.title", "Get in Touch")}
                    </h2>
                    <p className="text-[15px] text-muted-foreground leading-relaxed max-w-md mb-10">
                        {t("contact.subtitle", "For collaboration inquiries, graduate applications, or press requests, reach the laboratory directly.")}
                    </p>
                    
                    <div className="space-y-8 text-sm">
                        {contactInfo.map((info, idx) => (
                            <div key={idx}>
                                <p className="text-xs uppercase tracking-wide text-primary font-semibold mb-1.5">{info.label}</p>
                                <p className="text-foreground">{info.value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sağ: Form */}
                <form className="space-y-7" onSubmit={(e) => e.preventDefault()}>
                    <div>
                        <label className="block text-xs uppercase tracking-wide text-muted-foreground mb-1">
                            {t("contact.form.name", "Name")}
                        </label>
                        <input 
                            type="text" 
                            className="w-full bg-transparent border-b border-border py-2.5 outline-none transition-colors focus:border-primary text-foreground" 
                            placeholder={t("contact.form.name_placeholder", "Your full name")} 
                        />
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-wide text-muted-foreground mb-1">
                            {t("contact.form.email", "Email")}
                        </label>
                        <input 
                            type="email" 
                            className="w-full bg-transparent border-b border-border py-2.5 outline-none transition-colors focus:border-primary text-foreground" 
                            placeholder={t("contact.form.email_placeholder", "you@institution.edu")} 
                        />
                    </div>
                    
                    <div>
                        <label className="block text-xs uppercase tracking-wide text-muted-foreground mb-1">
                            {t("contact.form.message", "Message")}
                        </label>
                        <textarea 
                            rows="4" 
                            className="w-full bg-transparent border-b border-border py-2.5 outline-none transition-colors focus:border-primary text-foreground resize-none" 
                            placeholder={t("contact.form.message_placeholder", "Tell us about your inquiry")}
                        ></textarea>
                    </div>

                    <button 
                        type="submit"
                        className="bg-primary text-primary-foreground px-7 py-3.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors duration-200 cursor-pointer"
                    >
                        {t("contact.form.submit", "Send Message")}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Contact;