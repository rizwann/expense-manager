import { useState, useEffect } from "react"
import "./weather.scss"
import { calculateDistance } from "../../utils/utils"

const Weather = () => {
  const [coordinates, setCoordinates] = useState<{ lat: number, lon: number } | null>(null)
  const [weather, setWeather] = useState<{ city: string, temp: number, icon: string } | null>(null)
  
  const THRESHOLD_DISTANCE = 1 
  
  const getCoordinatesFromStorage = () => {
    const storedCoordinates = localStorage.getItem("coordinates")
    if (storedCoordinates) {
      return JSON.parse(storedCoordinates)
    }
    return null
  }
  
  const saveCoordinatesToStorage = (lat: number, lon: number) => {
    localStorage.setItem("coordinates", JSON.stringify({ lat, lon }))
  }
  
  const fetchWeatherData = async (lat: number, lon: number) => {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}`
    )
    const data = await response.json()
    setWeather(
      {
        city: data.location.name,
        temp: data.current.temp_c,
        icon: data.current.condition.icon
      }
    )
  }
  
  const checkAndUpdateLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          const storedCoordinates = getCoordinatesFromStorage()
          if (storedCoordinates) {
            const distance = calculateDistance(
              storedCoordinates.lat,
              storedCoordinates.lon,
              latitude,
              longitude
            )
  
            if (distance > THRESHOLD_DISTANCE) {
              setCoordinates({ lat: latitude, lon: longitude })
              saveCoordinatesToStorage(latitude, longitude)
              fetchWeatherData(latitude, longitude)
            }
          } else {
            setCoordinates({ lat: latitude, lon: longitude })
            saveCoordinatesToStorage(latitude, longitude)
            fetchWeatherData(latitude, longitude)
          }
        },
        (error) => console.error("Error getting location:", error.message)
      )
    }
  }
  
  useEffect(() => {
    const storedCoordinates = getCoordinatesFromStorage()
    if (storedCoordinates) {
      setCoordinates(storedCoordinates)
      fetchWeatherData(storedCoordinates.lat, storedCoordinates.lon)
    } else {
      checkAndUpdateLocation()
    }
  
    const intervalId = setInterval(() => {
      checkAndUpdateLocation()
    }, 5000
    )
  
    return () => clearInterval(intervalId)
  }, [])
  return (
    <>
      {coordinates && weather && (
        <div className="weather">
          <img src={weather.icon} alt="Weather Icon" className="weather__icon" />
          <span className="weather__temp">{Math.round(weather.temp)}°C</span>
          <span className="weather__city">{weather.city}</span>
        </div>
      )}
    </>
  )
}

export default Weather
