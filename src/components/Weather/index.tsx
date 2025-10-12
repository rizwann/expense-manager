import { useEffect, useMemo, useState } from "react"
import "./weather.scss"
import { calculateDistance } from "../../utils/utils"

type Coordinates = { lat: number; lon: number }
type WeatherData = { city: string; temp: number; icon: string; timestamp: number }
type WeatherStatus = "idle" | "loading" | "ready" | "error"

const COORDINATE_STORAGE_KEY = "coordinates"
const WEATHER_STORAGE_KEY = "weather-data"
const WEATHER_TTL = 30 * 60 * 1000 // 30 minutes
const THRESHOLD_DISTANCE_KM = 1

const readJsonFromStorage = <T,>(key: string): T | null => {
  if (typeof window === "undefined") return null
  try {
    const storedValue = window.localStorage.getItem(key)
    if (!storedValue) return null
    return JSON.parse(storedValue) as T
  } catch (error) {
    console.error(`Failed to read ${key} from storage`, error)
    return null
  }
}

const saveJsonToStorage = (key: string, value: unknown) => {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Failed to save ${key} to storage`, error)
  }
}

const Weather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [status, setStatus] = useState<WeatherStatus>("idle")
  const secureContext =
    typeof window !== "undefined"
      ? window.isSecureContext ||
      window.location.protocol === "capacitor:" ||
      window.location.protocol === "ionic:"
      : true

  const hasFreshWeather = useMemo(() => {
    if (!weather) return false
    return Date.now() - weather.timestamp <= WEATHER_TTL
  }, [weather])

  const getCoordinatesFromStorage = () =>
    readJsonFromStorage<Coordinates>(COORDINATE_STORAGE_KEY)

  const saveCoordinatesToStorage = (lat: number, lon: number) =>
    saveJsonToStorage(COORDINATE_STORAGE_KEY, { lat, lon })

  const getWeatherFromStorage = () => {
    const storedWeather = readJsonFromStorage<WeatherData>(WEATHER_STORAGE_KEY)
    if (!storedWeather) return null
    if (Date.now() - storedWeather.timestamp > WEATHER_TTL) return null
    return storedWeather
  }

  const saveWeatherToStorage = (data: WeatherData) =>
    saveJsonToStorage(WEATHER_STORAGE_KEY, data)

  const fetchWeatherData = async (lat: number, lon: number) => {
    const isInitialLoad = !hasFreshWeather
    if (isInitialLoad) {
      setStatus("loading")
    }

    try {
      const apiKey = import.meta.env.VITE_WEATHER_API_KEY
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}`
      )

      if (!response.ok) {
        throw new Error(`Weather request failed with status ${response.status}`)
      }

      const data = await response.json()
      const nextWeather: WeatherData = {
        city: data.location.name,
        temp: data.current.temp_c,
        icon: data.current.condition.icon,
        timestamp: Date.now(),
      }

      setWeather(nextWeather)
      saveWeatherToStorage(nextWeather)
      setStatus("ready")
    } catch (error) {
      console.error("Error fetching weather data:", error)
      setStatus((prev) => (prev === "ready" || hasFreshWeather ? "ready" : "error"))
    }
  }

  const checkAndUpdateLocation = (forceFetch = false) => {
    if (!secureContext) {
      setStatus("error")
      return
    }

    if (!navigator.geolocation) {
      setStatus((prev) => (prev === "ready" || hasFreshWeather ? "ready" : "error"))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        const storedCoordinates = getCoordinatesFromStorage()

        const shouldUpdateWeather = (() => {
          if (!storedCoordinates) return true
          if (forceFetch) return true

          const distanceMoved = calculateDistance(
            storedCoordinates.lat,
            storedCoordinates.lon,
            latitude,
            longitude
          )

          return distanceMoved > THRESHOLD_DISTANCE_KM
        })()
        saveCoordinatesToStorage(latitude, longitude)

        if (shouldUpdateWeather) {
          fetchWeatherData(latitude, longitude)
        }
      },
      (error) => {
        console.error("Error getting location:", error.message)
        setStatus((prev) => (prev === "ready" || hasFreshWeather ? "ready" : "error"))
      }
    )
  }

  useEffect(() => {
    if (!secureContext) {
      setStatus("error")
      return
    }

    const storedCoordinates = getCoordinatesFromStorage()
    const storedWeather = getWeatherFromStorage()

    if (storedWeather) {
      setWeather(storedWeather)
      setStatus("ready")
    }

    if (storedCoordinates) {
      fetchWeatherData(storedCoordinates.lat, storedCoordinates.lon)
    } else {
      checkAndUpdateLocation(true)
    }

    const intervalId = window.setInterval(() => {
      checkAndUpdateLocation()
    }, 5 * 60 * 1000)

    return () => window.clearInterval(intervalId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  if (weather) {
    return (
      <div className="weather" data-state={status}>
        <img src={weather.icon} alt="Weather Icon" className="weather__icon" />
        <span className="weather__temp">{Math.round(weather.temp)}°C</span>
        <span className="weather__city">{weather.city}</span>
      </div>
    )
  }

  if (status === "loading") {
    return <span className="weather__status">Loading weather…</span>
  }

  if (!secureContext) {
    return null
  }

  return null
}


export default Weather
