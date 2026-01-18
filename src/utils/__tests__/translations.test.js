import { describe, it, expect } from 'vitest'
import { translations, images } from '../translations'

describe('translations', () => {
  it('has all required languages', () => {
    expect(translations).toHaveProperty('en')
    expect(translations).toHaveProperty('ko')
    expect(translations).toHaveProperty('zh')
  })

  it('each language has all required keys', () => {
    const requiredKeys = [
      'title', 'subtitle', 'heading', 'paragraph',
      'language', 'culture', 'society', 'politics', 'arts',
      'gamer', 'ending', 'ending2',
      'linkCopied', 'shareTooltip', 'languageTooltip', 'description'
    ]

    Object.keys(translations).forEach(lang => {
      requiredKeys.forEach(key => {
        expect(translations[lang]).toHaveProperty(key)
      })
    })
  })
})

describe('images', () => {
  it('has 5 images', () => {
    expect(images).toHaveLength(5)
  })

  it('each image has src and caption for all languages', () => {
    images.forEach(image => {
      expect(image).toHaveProperty('src')
      expect(image).toHaveProperty('caption')
      expect(image.caption).toHaveProperty('en')
      expect(image.caption).toHaveProperty('ko')
      expect(image.caption).toHaveProperty('zh')
    })
  })
})
