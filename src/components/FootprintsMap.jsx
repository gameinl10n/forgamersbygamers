import { memo, useRef, useState, useEffect, useImperativeHandle, forwardRef, useCallback } from 'react'
import {
  MapContainer,
  TileLayer,
  ZoomControl,
  useMap,
  CircleMarker,
  Tooltip,
  Popup,
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import './FootprintsMap.css'
import { gamePlaces, travelPlaces, colors, countryColors } from '../utils/mapData'

/* ---------- 지도 상수: 초기 뷰, 타일 URL, 마커 스타일 ---------- */
const INITIAL_BOUNDS = [[25, 110], [45, 145]]
const CARTO_LIGHT = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
const CARTO_DARK = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
const ESRI_URL = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}'
const TRAVEL_MARKER_OPTIONS = { color: '#666', weight: 1, fillColor: '#888', fillOpacity: 0.9 }
const GAME_MARKER_OPTIONS = colors.map((color) => ({ color: '#444', weight: 2, fillColor: color, fillOpacity: 0.9 }))
const imgToUrls = (img) => (Array.isArray(img) ? img : [img])
const stopProp = (e) => e.originalEvent?.stopPropagation()

/* 지도 마운트 시 한 번만 초기 bounds 적용 + 부모에 초기 뷰 전달. 초기 영역 바꾸려면 INITIAL_BOUNDS 수정 */
function MapInitializer({ onInitialView }) {
  const map = useMap()
  const hasInitializedRef = useRef(false)
  useEffect(() => {
    if (hasInitializedRef.current) return
    hasInitializedRef.current = true
    map.fitBounds(INITIAL_BOUNDS)
    map.setZoom(map.getZoom() + 1)
    onInitialView?.({ center: map.getCenter(), zoom: map.getZoom() })
  }, [map, onInitialView])
  return null
}

/* 휠/더블클릭/박스 줌 비활성화. 지도는 +/- 버튼으로만 줌 */
function MapZoomBlocker() {
  const map = useMap()
  useEffect(() => {
    if (!map) return
    map.doubleClickZoom?.disable()
    map.scrollWheelZoom?.disable()
    if (map.tap) map.tap.disable()
    if (map.boxZoom) map.boxZoom.disable()
  }, [map])
  return null
}

/* 기본 뷰로 돌아가기 버튼. initialViewRef는 MapInitializer에서 채움 */
function RecenterButton({ initialViewRef, title }) {
  const map = useMap()
  return (
    <button
      type="button"
      className="footprints-map-recenter"
      onClick={() => {
        const v = initialViewRef?.current
        if (v?.center) map.flyTo(v.center, v.zoom)
      }}
      aria-label={title}
      title={title}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
        <path d="M12 3l9 9h-3v9h-12v-9h-3l9-9z" />
      </svg>
    </button>
  )
}

/* 마커 클릭 시 나오는 팝업: 제목, 국가 뱃지, 설명, 이미지 캐러셀. 다국어 문구는 props로 전달 */
const PopupContent = memo(function PopupContent({
  title,
  description,
  imgUrls,
  country,
  shadowClass,
  loadingText = 'Loading image...',
  imageErrorText = 'Image could not be loaded',
}) {
  const [loaded, setLoaded] = useState({})
  const [error, setError] = useState({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const badgeColor = countryColors[country] || '#888'

  return (
    <>
      <b>{title}</b>
      <br />
      {country ? (
        <>
          <span className="country-badge" style={{ background: badgeColor, margin: '4px 0' }}>
            {country}
          </span>
          <br />
        </>
      ) : null}
      {description?.trim() ? (
        <>
          <span>{description}</span>
          <br />
        </>
      ) : null}
      <div className="popup-carousel">
        {imgUrls.map((url, index) => (
          <div key={index} className={`popup-slide ${index === currentIndex ? 'active' : ''}`}>
            {!loaded[index] && !error[index] && (
              <div className="popup-loading show">
                <div className="spinner" />
                {loadingText}
              </div>
            )}
            {error[index] && (
              <div className="popup-image-error">{imageErrorText}</div>
            )}
            <img
              src={url}
              alt=""
              className={`popup-img ${shadowClass}`}
              style={{
                display: loaded[index] && !error[index] ? 'block' : 'none',
                marginTop: '2px',
                opacity: loaded[index] && !error[index] ? 1 : 0,
              }}
              onLoad={() => {
                setLoaded((prev) => ({ ...prev, [index]: true }))
                setError((prev) => ({ ...prev, [index]: false }))
              }}
              onError={() => {
                setLoaded((prev) => ({ ...prev, [index]: true }))
                setError((prev) => ({ ...prev, [index]: true }))
              }}
            />
          </div>
        ))}
        {imgUrls.length > 1 && (
          <>
            <button
              type="button"
              className="popup-prev"
              onClick={() => setCurrentIndex((i) => (i - 1 + imgUrls.length) % imgUrls.length)}
              aria-label="이전"
            >
              ‹
            </button>
            <button
              type="button"
              className="popup-next"
              onClick={() => setCurrentIndex((i) => (i + 1) % imgUrls.length)}
              aria-label="다음"
            >
              ›
            </button>
          </>
        )}
      </div>
    </>
  )
})

/* 타일/마커/팝업 렌더 + openPopup imperative. 타일 오류 시 onFallback 호출 → Esri 폴백 */
const MapContent = forwardRef(function MapContent(
  {
    useFallback,
    initialViewRef,
    onInitialView,
    onFallback,
    onPopupOpen,
    onPopupClose,
    isDarkMode,
    recenterTitle,
    loadingText,
    imageErrorText,
  },
  ref
) {
  const map = useMap()
  const gameMarkerRefs = useRef([])
  const travelMarkerRefs = useRef([])

  useImperativeHandle(ref, () => ({
    openPopup(category, index, options = {}) {
      const refs = category === 'game' ? gameMarkerRefs.current : travelMarkerRefs.current
      const layer = refs[index]
      const places = category === 'game' ? gamePlaces : travelPlaces
      const coords = places[index]?.coords
      if (options.flyTo && coords) {
        const zoom = initialViewRef?.current?.zoom ?? map.getZoom()
        map.flyTo(coords, zoom, { duration: 0.4 })
      }
      if (layer?.openPopup) layer.openPopup()
    },
  }))

  useEffect(() => {
    const handlePopupOpen = () => {
      ;[...gameMarkerRefs.current, ...travelMarkerRefs.current].forEach((m) => m?.closeTooltip?.())
      const marker = map._popup?._source
      if (onPopupOpen && marker) {
        const gi = gameMarkerRefs.current.indexOf(marker)
        const ti = travelMarkerRefs.current.indexOf(marker)
        if (gi >= 0) onPopupOpen('game', gi)
        else if (ti >= 0) onPopupOpen('travel', ti)
      }
    }
    const handlePopupClose = () => onPopupClose?.()
    map.on('popupopen', handlePopupOpen)
    map.on('popupclose', handlePopupClose)
    return () => {
      map.off('popupopen', handlePopupOpen)
      map.off('popupclose', handlePopupClose)
    }
  }, [map, onPopupOpen, onPopupClose])

  return (
    <>
      <TileLayer
        url={isDarkMode ? CARTO_DARK : CARTO_LIGHT}
        subdomains="abcd"
        maxZoom={19}
        noWrap
        zIndex={1}
        style={{ display: useFallback ? 'none' : undefined }}
        eventHandlers={{ tileerror: onFallback }}
      />
      {useFallback && (
        <TileLayer url={ESRI_URL} maxZoom={16} noWrap zIndex={1} />
      )}
      <MapInitializer onInitialView={onInitialView} />
      <MapZoomBlocker />
      <ZoomControl position="topleft" />
      <RecenterButton initialViewRef={initialViewRef} title={recenterTitle} />

      {travelPlaces.map((place, i) => (
        <CircleMarker
          key={`t-${i}`}
          ref={(el) => (travelMarkerRefs.current[i] = el)}
          center={place.coords}
          radius={4}
          pathOptions={TRAVEL_MARKER_OPTIONS}
          eventHandlers={{ click: stopProp }}
        >
          <Tooltip permanent={false} direction="top">
            {place.title}
          </Tooltip>
          <Popup autoPan={false}>
            <PopupContent
              title={place.title}
              description={place.description}
              imgUrls={imgToUrls(place.img)}
              country={place.country}
              shadowClass=""
              loadingText={loadingText}
              imageErrorText={imageErrorText}
            />
          </Popup>
        </CircleMarker>
      ))}

      {gamePlaces.map((place, i) => {
        const color = colors[i % colors.length]
        const shadowClass = `popup-shadow-${color.slice(1).toUpperCase()}`
        return (
          <CircleMarker
            key={`g-${i}`}
            ref={(el) => (gameMarkerRefs.current[i] = el)}
            center={place.coords}
            radius={10}
            pathOptions={GAME_MARKER_OPTIONS[i % GAME_MARKER_OPTIONS.length]}
            eventHandlers={{ click: stopProp }}
          >
            <Tooltip permanent={false} direction="top">
              {place.title}
            </Tooltip>
            <Popup autoPan={false}>
              <PopupContent
                title={place.title}
                description={place.description}
                imgUrls={imgToUrls(place.img)}
                country={place.country}
                shadowClass={shadowClass}
                loadingText={loadingText}
                imageErrorText={imageErrorText}
              />
            </Popup>
          </CircleMarker>
        )
      })}
    </>
  )
})

/* ---------- 메인: 지도 섹션 + 게임/여행 토글 + 마커 목록. 호버/포인터다운은 부모에서 휠 제어용 ---------- */
const FootprintsMap = memo(function FootprintsMap({ language, t, isDarkMode, onMapHoverChange, onMapPointerDown }) {
  const [useFallback, setUseFallback] = useState(false)
  const [listOpen, setListOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState(null)
  const [openPopupCategory, setOpenPopupCategory] = useState(null)
  const [openPopupIndex, setOpenPopupIndex] = useState(null)
  const initialViewRef = useRef(null)
  const mapContentRef = useRef(null)
  const listRef = useRef(null)
  const gameBtnRef = useRef(null)
  const travelBtnRef = useRef(null)
  const mapContainerRef = useRef(null)

  /* 컨테이너 내부 휠을 캡처해서 Leaflet으로 전달하지 않음(무한 확대 방지) */
  useEffect(() => {
    const el = mapContainerRef.current
    if (!el) return
    const onWheelCapture = (e) => {
      if (!el.contains(e.target)) return
      e.stopPropagation()
      e.preventDefault()
    }
    el.addEventListener('wheel', onWheelCapture, true)
    return () => el.removeEventListener('wheel', onWheelCapture, true)
  }, [])

  const handleInitialView = useCallback((view) => {
    if (view?.center) initialViewRef.current = { center: view.center, zoom: view.zoom }
  }, [])

  const handleCategoryClick = useCallback((category) => {
    if (listOpen && activeCategory === category) {
      setListOpen(false)
      setActiveCategory(null)
    } else {
      setActiveCategory(category)
      setListOpen(true)
    }
  }, [listOpen, activeCategory])

  const handleFallback = useCallback(() => setUseFallback(true), [])
  const handlePopupOpen = useCallback((cat, idx) => {
    setOpenPopupCategory(cat)
    setOpenPopupIndex(idx)
  }, [])
  const handlePopupClose = useCallback(() => {
    setOpenPopupCategory(null)
    setOpenPopupIndex(null)
  }, [])
  const handleMapHover = useCallback((hovered) => onMapHoverChange?.(hovered), [onMapHoverChange])
  const handleMapPointerDown = useCallback(() => onMapPointerDown?.(), [onMapPointerDown])

  /* 목록/버튼 밖 클릭 시 목록 닫기 */
  useEffect(() => {
    const handler = (e) => {
      if (listRef.current?.contains(e.target) || gameBtnRef.current?.contains(e.target) || travelBtnRef.current?.contains(e.target)) return
      setListOpen(false)
      setActiveCategory(null)
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  const places = activeCategory === 'game' ? gamePlaces : travelPlaces
  const listTitle =
    activeCategory === 'game'
      ? (t?.mapListTitleAcgn ?? 'ACGN')
      : (t?.mapListTitleTravel ?? 'Travel')

  return (
    <div className="footprints-map-wrap">
      <section className="footprints-map-section">
        <div
          ref={mapContainerRef}
          className="footprints-map-container"
          id="map"
          onMouseEnter={() => handleMapHover(true)}
          onMouseLeave={() => handleMapHover(false)}
          onPointerDown={handleMapPointerDown}
        >
          <MapContainer
            center={[36, 128]}
            zoom={5}
            className="footprints-map"
            zoomControl={false}
            attributionControl={false}
            scrollWheelZoom={false}
            doubleClickZoom={false}
            style={{ height: '100%' }}
          >
            <MapContent
              ref={mapContentRef}
              useFallback={useFallback}
              initialViewRef={initialViewRef}
              onInitialView={handleInitialView}
              onFallback={handleFallback}
              onPopupOpen={handlePopupOpen}
              onPopupClose={handlePopupClose}
              isDarkMode={isDarkMode}
              recenterTitle={t?.mapRecenter}
              loadingText={t?.mapPopupLoadingImage}
              imageErrorText={t?.mapPopupImageError}
            />
          </MapContainer>

          <div className="footprints-map-attribution">
            ©{' '}
            <a href="https://www.openstreetmap.org/" target="_blank" rel="noopener noreferrer">
              OpenStreetMap
            </a>{' '}
            contributors ©{' '}
            <a href="https://www.carto.com/" target="_blank" rel="noopener noreferrer">
              CARTO
            </a>
          </div>

          <div className="footprints-map-buttons">
            <button
              ref={gameBtnRef}
              type="button"
              className="marker-btn"
              id="game-btn"
              aria-label={t?.mapGameMarkers ?? 'Game markers'}
              onClick={() => handleCategoryClick('game')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
                <path d="M6 6h4v4H6V6zm8 0h4v4h-4V6zM6 14h4v4H6v-4zm8 0h4v4h-4v-4z" />
              </svg>
            </button>
            <button
              ref={travelBtnRef}
              type="button"
              className="marker-btn"
              id="travel-btn"
              aria-label={t?.mapTravelMarkers ?? 'Travel markers'}
              onClick={() => handleCategoryClick('travel')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
                <path d="M2.5 19.5l19-7-19-7v6l12 1-12 1v6z" />
              </svg>
            </button>
          </div>

          <div
            ref={listRef}
            className={`footprints-map-marker-list ${listOpen ? 'open' : ''}`}
            id="marker-list"
          >
            <div className="footprints-map-marker-list-title" id="marker-list-title">
              {listTitle}
            </div>
            <ul className="footprints-map-marker-items" id="marker-items">
              {places.map((place, index) => {
                const color =
                  activeCategory === 'game' ? colors[index % colors.length] : '#888'
                const badgeColor = countryColors[place.country] || '#888'
                const isActive =
                  openPopupCategory === activeCategory && openPopupIndex === index
                return (
                  <li
                    key={`${activeCategory}-${index}`}
                    className={isActive ? 'active' : ''}
                    onClick={() => {
                      setOpenPopupCategory(activeCategory)
                      setOpenPopupIndex(index)
                      mapContentRef.current?.openPopup(activeCategory, index, { flyTo: true })
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        mapContentRef.current?.openPopup(activeCategory, index)
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <span className="circle" style={{ background: color }} />
                    <span className="country-badge" style={{ background: badgeColor }}>
                      {place.country || ''}
                    </span>
                    <span>{place.title}</span>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
})

export default FootprintsMap
