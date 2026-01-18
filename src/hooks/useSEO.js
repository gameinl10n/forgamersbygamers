import { useEffect } from 'react'
import { translations } from '../utils/translations'

export const useSEO = (language) => {
  useEffect(() => {
    const t = translations[language]
    
    // Title 업데이트
    document.title = t.title
    
    // Meta description
    let metaDescription = document.querySelector('meta[name="description"]')
    if (!metaDescription) {
      metaDescription = document.createElement('meta')
      metaDescription.setAttribute('name', 'description')
      document.head.appendChild(metaDescription)
    }
    metaDescription.setAttribute('content', t.description)
    
    // Open Graph tags
    const updateOrCreateMeta = (property, content) => {
      let meta = document.querySelector(`meta[property="${property}"]`)
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('property', property)
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', content)
    }
    
    updateOrCreateMeta('og:title', t.title)
    updateOrCreateMeta('og:description', t.description)
    updateOrCreateMeta('og:type', 'website')
    updateOrCreateMeta('og:url', window.location.href)
    
    // Language attribute
    document.documentElement.lang = language
    
  }, [language])
}
