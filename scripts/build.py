#!/usr/bin/env python3
"""Generate FR/EN Coconsult landing pages from versioned copy without dependencies."""
from pathlib import Path
from html import escape
import json

ROOT=Path(__file__).resolve().parent.parent
SITE=ROOT/'site'
COPY={
 'fr':{
  'meta_title':'COCONSULT — Ingénierie logicielle, paiements & équipes dédiées',
  'meta_desc':'Coconsult accompagne vos projets d’ingénierie logicielle, QA/testing, paiements et intégration de systèmes. Expertise en France, équipe à Sfax.',
  'nav_expertise':'Expertises','nav_method':'Notre approche','nav_contact':'Contact','header_cta':'Parlons de votre projet',
  'eyebrow':'INGÉNIERIE LOGICIELLE · FRANCE & TUNISIE',
  'hero_title':'Des systèmes plus fiables.<br><span>Des projets qui avancent.</span>',
  'hero_text':'Nous concevons, intégrons et fiabilisons les applications de votre activité. De l’expertise individuelle aux équipes dédiées, Coconsult vous aide à livrer avec maîtrise.',
  'hero_primary':'Parlons de votre projet','hero_secondary':'Constituer une équipe',
  'facts':['Ingénierie & intégration','Équipes dédiées à Sfax','De l’architecture à la production'],
  'diagram_header':'L’INGÉNIERIE QUI RELIE VOS SYSTÈMES',
  'diag_center':'Vos systèmes','diag_sub':'Fiabilité · Intégration · Delivery',
  'diag_1':'Paiements & API','diag_2':'QA & Testing','diag_3':'Workflows métier','diag_4':'Cloud & DevOps',
  'panel_note':'Connecter les systèmes. Sécuriser les flux. Livrer des solutions exploitables.',
  'section_kicker':'NOS EXPERTISES','section_title':'Une équipe pour vos défis techniques.','section_desc':'Des offres ciblées, avec un interlocuteur technique qui comprend vos contraintes.',
  'cards':[
   ('01','Engineering & équipes dédiées','Développement Java, architectures applicatives et mobilisation de profils adaptés à vos projets.','Discuter de votre équipe'),
   ('02','QA & software testing','Tests fonctionnels, API, non-régression et automatisation selon les besoins et les profils mobilisés.','Parler de vos tests'),
   ('03','Payments & FinTech','Intégrations transactionnelles, résilience, idempotence et fiabilisation des parcours de paiement.','Échanger sur les paiements'),
   ('04','Automatisation métier & IA','Connexion ERP, CRM, GED et workflows ; assistance IA lorsque le contexte métier le justifie.','Évaluer un processus')
  ],
  'how_kicker':'NOTRE APPROCHE','how_title':'Un partenaire technique, pas une promesse de plus.',
  'how_desc':'Nous cadrons le besoin, proposons une solution réaliste, puis accompagnons sa mise en œuvre et son exploitation.',
  'how_steps':[('01','Comprendre','Vos objectifs, vos systèmes et vos contraintes.'),('02','Concevoir','Une architecture adaptée et un périmètre mesurable.'),('03','Livrer','Du développement aux tests et à la mise en production.')],
  'contact_kicker':'PARLONS DE VOTRE PROJET','contact_title':'Votre prochain projet commence par une conversation.',
  'contact_desc':'Renfort d’équipe, intégration, paiement ou automatisation : décrivez-nous le besoin et nous organiserons un premier échange.',
  'contact_button':'Écrire à Coconsult','contact_email':'contact@coconsult.fr','footer_line':'Ingénierie, intégration et équipes techniques · Paris & Sfax',
  'footer_right':'Version initiale — site en évolution',
  'skip':'Aller au contenu','lang_aria':'Passer à la version anglaise',
  'contact_subject':'Demande de contact — Coconsult',
  'team_subject':'Constituer une équipe — Coconsult'
 },
 'en':{
  'meta_title':'COCONSULT — Software engineering, payments & dedicated teams',
  'meta_desc':'Coconsult supports software engineering, QA/testing, payment systems and business integrations. France-based expertise and delivery teams in Sfax, Tunisia.',
  'nav_expertise':'Expertise','nav_method':'Our approach','nav_contact':'Contact','header_cta':'Discuss your project',
  'eyebrow':'SOFTWARE ENGINEERING · FRANCE & TUNISIA',
  'hero_title':'Reliable systems.<br><span>Projects that move forward.</span>',
  'hero_text':'We build, integrate and strengthen business-critical applications. From individual specialists to dedicated teams, Coconsult helps you deliver with confidence.',
  'hero_primary':'Discuss your project','hero_secondary':'Build your team',
  'facts':['Engineering & integration','Dedicated teams in Sfax','From architecture to production'],
  'diagram_header':'ENGINEERING THAT CONNECTS YOUR SYSTEMS',
  'diag_center':'Your systems','diag_sub':'Reliability · Integration · Delivery',
  'diag_1':'Payments & APIs','diag_2':'QA & Testing','diag_3':'Business workflows','diag_4':'Cloud & DevOps',
  'panel_note':'Connect systems. Safeguard transactions. Deliver production-ready solutions.',
  'section_kicker':'OUR EXPERTISE','section_title':'The right engineering for complex challenges.','section_desc':'Focused services, with technical expertise that understands your constraints.',
  'cards':[
   ('01','Engineering & dedicated teams','Java development, application architecture and engineering talent matched to your project.','Build your team'),
   ('02','QA & software testing','Functional, API, regression and automated testing, based on your needs and available expertise.','Discuss QA needs'),
   ('03','Payments & FinTech','Transactional integrations, resilience, idempotency and reliable payment flows.','Discuss payments'),
   ('04','Business automation & AI','ERP, CRM and document-system integrations, workflows and supervised AI where it adds value.','Explore automation')
  ],
  'how_kicker':'OUR APPROACH','how_title':'A technical partner, not another promise.',
  'how_desc':'We understand the challenge, define a realistic solution and support its delivery and operations.',
  'how_steps':[('01','Understand','Your goals, systems and constraints.'),('02','Design','A suitable architecture and measurable scope.'),('03','Deliver','From development and testing to production.')],
  'contact_kicker':'LET’S TALK','contact_title':'Your next project starts with a conversation.',
  'contact_desc':'Dedicated teams, payment engineering, integration or automation: tell us what you need and we’ll arrange an initial discussion.',
  'contact_button':'Email Coconsult','contact_email':'contact@coconsult.fr','footer_line':'Engineering, integration and dedicated teams · Paris & Sfax',
  'footer_right':'Early version — site evolving',
  'skip':'Skip to content','lang_aria':'Switch to French',
  'contact_subject':'Project enquiry — Coconsult',
  'team_subject':'Dedicated team enquiry — Coconsult'
 }
}


def render(lang, d):
    en=lang=='en'; prefix='/en/' if en else '/'; other='/' if en else '/en/'
    nav=''.join(f'<a href="{prefix}#{a}">{escape(d[label])}</a>' for a,label in [('expertise','nav_expertise'),('approche','nav_method'),('contact','nav_contact')])
    facts=''.join(f'<li><svg aria-hidden="true" viewBox="0 0 20 20"><path d="m4 10 4 4 8-8"/></svg>{escape(s)}</li>' for s in d['facts'])
    cards=''.join(f'''<article class="service-card"><div class="card-top"><span class="service-no">{num}</span><svg aria-hidden="true" class="tiny-arrow" viewBox="0 0 24 24"><path d="M5 19 19 5M8 5h11v11"/></svg></div><h3>{escape(title)}</h3><p>{escape(desc)}</p><a href="mailto:{d['contact_email']}?subject={escape(d['contact_subject'].replace(' ','%20'),quote=True)}">{escape(call)} <span aria-hidden="true">↗</span></a></article>''' for num,title,desc,call in d['cards'])
    steps=''.join(f'<div class="step"><span>{escape(num)}</span><div><h3>{escape(title)}</h3><p>{escape(desc)}</p></div></div>' for num,title,desc in d['how_steps'])
    def esc(k): return escape(d[k])
    return f'''<!doctype html>
<html lang="{lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>{esc('meta_title')}</title>
  <meta name="description" content="{esc('meta_desc')}">
  <meta name="theme-color" content="#08162d">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Coconsult">
  <meta property="og:title" content="{esc('meta_title')}">
  <meta property="og:description" content="{esc('meta_desc')}">
  <meta property="og:url" content="https://coconsult.fr{prefix}">
  <link rel="canonical" href="https://coconsult.fr{prefix}">
  <link rel="alternate" hreflang="fr" href="https://coconsult.fr/">
  <link rel="alternate" hreflang="en" href="https://coconsult.fr/en/">
  <link rel="alternate" hreflang="x-default" href="https://coconsult.fr/">
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/assets/styles.css">
  <script src="/assets/main.js" defer></script>
</head>
<body>
<a class="skip-link" href="#main">{esc('skip')}</a>
<div class="hero-wrap">
  <header class="header container">
    <a class="brand" href="{prefix}" aria-label="Coconsult — Home">
      <span class="mark" aria-hidden="true"><span></span><span></span><span></span></span>
      <span class="brand-text">co<span>consult</span><span class="brand-period">.</span></span>
    </a>
    <nav class="desktop-nav" aria-label="Main navigation">{nav}</nav>
    <div class="header-actions">
      <a class="lang" lang="{'fr' if en else 'en'}" href="{other}" aria-label="{esc('lang_aria')}">{'FR' if en else 'EN'} <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m7 10 5 5 5-5"/></svg></a>
      <a class="header-contact" href="mailto:{esc('contact_email')}?subject={esc('contact_subject').replace(' ','%20')}">{esc('header_cta')} <span aria-hidden="true">↗</span></a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Menu"><span></span><span></span></button>
    </div>
  </header>
  <nav class="mobile-nav" id="mobile-menu" aria-label="Mobile navigation" hidden>{nav}<a href="#contact">{esc('header_cta')}</a></nav>
  <main id="main">
    <section class="hero container" aria-labelledby="hero-heading">
      <div class="hero-copy">
        <div class="eyebrow"><span class="pulse-dot" aria-hidden="true"></span>{esc('eyebrow')}</div>
        <h1 id="hero-heading">{d['hero_title']}</h1>
        <p class="hero-lead">{esc('hero_text')}</p>
        <div class="hero-buttons">
          <a class="btn primary" href="mailto:{esc('contact_email')}?subject={esc('contact_subject').replace(' ','%20')}">{esc('hero_primary')} <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></a>
          <a class="btn secondary" href="mailto:{esc('contact_email')}?subject={esc('team_subject').replace(' ','%20')}">{esc('hero_secondary')} <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></a>
        </div>
        <ul class="hero-facts">{facts}</ul>
      </div>
      <div class="hero-visual" aria-label="{esc('diagram_header')}">
        <div class="visual-eyebrow"><span class="visual-status"></span>{esc('diagram_header')}</div>
        <div class="network" aria-hidden="true">
          <div class="network-glow"></div>
          <svg class="network-lines" viewBox="0 0 560 430" preserveAspectRatio="none"><path d="M280 216 120 102M280 216 440 102M280 216 115 334M280 216 441 334"/><circle cx="280" cy="216" r="150"/><circle cx="280" cy="216" r="192"/></svg>
          <div class="center-node"><span class="center-symbol"><i></i><i></i><i></i><i></i></span><strong>{esc('diag_center')}</strong><small>{esc('diag_sub')}</small></div>
          <div class="floating-node n1"><span class="node-badge"><svg viewBox="0 0 24 24"><path d="M4 8h16M7 5v14m10-14v14M4 16h16"/></svg></span>{esc('diag_1')}</div>
          <div class="floating-node n2"><span class="node-badge"><svg viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></svg></span>{esc('diag_2')}</div>
          <div class="floating-node n3"><span class="node-badge"><svg viewBox="0 0 24 24"><path d="M4 7h7v7H4zM14 10h6M14 14h6M7 14v4h13"/></svg></span>{esc('diag_3')}</div>
          <div class="floating-node n4"><span class="node-badge"><svg viewBox="0 0 24 24"><path d="M5 18a4 4 0 0 1 0-8 7 7 0 0 1 14 1 4 4 0 0 1-1 7z"/></svg></span>{esc('diag_4')}</div>
        </div>
        <div class="visual-bottom"><span class="visual-bars"><i></i><i></i><i></i><i></i><i></i></span>{esc('panel_note')}</div>
      </div>
    </section>
  </main>
</div>
<section class="services section" id="expertise" aria-labelledby="expertise-heading"><div class="container"><div class="section-intro"><div><span class="kicker">{esc('section_kicker')}</span><h2 id="expertise-heading">{esc('section_title')}</h2></div><p>{esc('section_desc')}</p></div><div class="services-grid">{cards}</div></div></section>
<section class="approach section" id="approche"><div class="container approach-inner"><div class="approach-copy"><span class="kicker">{esc('how_kicker')}</span><h2>{esc('how_title')}</h2><p>{esc('how_desc')}</p></div><div class="steps">{steps}</div></div></section>
<section class="contact-section" id="contact"><div class="container contact-inner"><div><span class="kicker">{esc('contact_kicker')}</span><h2>{esc('contact_title')}</h2><p>{esc('contact_desc')}</p></div><a class="btn primary light" href="mailto:{esc('contact_email')}?subject={esc('contact_subject').replace(' ','%20')}">{esc('contact_button')} <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></a></div></section>
<footer class="footer"><div class="container footer-inner"><div class="brand-footer"><strong>coconsult<span>.</span></strong><small>{esc('footer_line')}</small></div><div class="footer-meta"><a href="mailto:{esc('contact_email')}">{esc('contact_email')}</a><span>{esc('footer_right')}</span></div></div></footer>
</body>
</html>'''

def main():
  for lang in ('fr','en'):
    dest=SITE/('en/index.html' if lang=='en' else 'index.html');dest.parent.mkdir(parents=True,exist_ok=True)
    dest.write_text(render(lang,COPY[lang]),encoding='utf-8')
  print('Built: site/index.html and site/en/index.html')
if __name__=='__main__': main()
