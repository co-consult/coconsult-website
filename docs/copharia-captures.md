# Captures COPHARIA

Ces indications ne figurent pas sur le site public.

COPHARIA reste en développement. Sans capture autorisée, la page montre trois capacités : Tableau de bord, Qualité, Laboratoire. Aucune interface n’est dessinée à leur place.

Pour afficher les captures autorisées du tableau de bord, de la qualité et du laboratoire, les transmettre puis les passer à `CophariaFeature` :

```astro
<CophariaFeature
  locale={locale}
  images={{
    dashboard: '/assets/copharia/dashboard.jpg',
    quality: '/assets/copharia/quality.jpg',
    lab: '/assets/copharia/lab.jpg',
  }}
/>
```

Les trois emplacements sont indépendants. Une image absente laisse seulement le nom de la capacité.
