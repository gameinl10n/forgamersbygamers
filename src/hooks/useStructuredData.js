import { useEffect } from 'react'
import { translations } from '../utils/translations'

export const useStructuredData = (language) => {
  useEffect(() => {
    const t = translations[language]
    
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": language === 'en' ? 'BYEONGUK' : language === 'ko' ? '병욱' : '权兵昱',
      "jobTitle": "Localization Specialist",
      "description": t.description,
      "url": window.location.href,
      "sameAs": [],
      "knowsAbout": [
        t.language,
        t.culture,
        t.society,
        t.politics,
        t.arts
      ],
      "hasOccupation": {
        "@type": "Occupation",
        "name": "Localization Specialist",
        "occupationLocation": {
          "@type": "Country",
          "name": "South Korea"
        }
      }
    }

    // Remove existing structured data script if any
    const existingScript = document.querySelector('script[type="application/ld+json"]')
    if (existingScript) {
      existingScript.remove()
    }

    // Add new structured data
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify(structuredData)
    document.head.appendChild(script)

    return () => {
      const scriptToRemove = document.querySelector('script[type="application/ld+json"]')
      if (scriptToRemove) {
        scriptToRemove.remove()
      }
    }
  }, [language])
}
