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
  console.log("Distance: s", storedCoordinates)
          if (storedCoordinates) {
            const distance = calculateDistance(
              storedCoordinates.lat,
              storedCoordinates.lon,
              latitude,
              longitude
            )
            console.log("Distance:", distance)
  
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
    },  15
  
    )
  
    return () => clearInterval(intervalId)
  }, [])
  return (
    <>
      {coordinates && (
       <div className="weather">
       {weather && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "white"
          }}>
          <img src={weather.icon} alt="Weather Icon" className="weather-img" style={{
            width: "32px",
            height: "32px",
          }} />
          <span style={{
            fontSize: "12px"
          }}>{Math.round(weather.temp)}°C</span>
           <span className="weather-city" style={{
            fontSize: "12px"
           }}>{weather.city}</span>
        </div>
       )}
     </div>
      )}
    </>
  )
}

export default Weather