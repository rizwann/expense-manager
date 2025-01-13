import { useState, useEffect } from "react"
import "./weather.scss"

const Weather = () => {
  const [coordinates, setCoordinates] = useState<{ lat: number, lon: number } | null>(null)
  const [weather, setWeather] = useState<any>(null)

  // Check if coordinates are stored in localStorage
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
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}&aqi=no`
      )
    const data = await response.json()
    setWeather({
        city: data.location.name,
        temp: data.current.temp_c,
        icon: data.current.condition.icon
    })
  }

  useEffect(() => {
    // Check if coordinates are already saved in localStorage
    const storedCoordinates = getCoordinatesFromStorage()

    if (storedCoordinates) {
      setCoordinates(storedCoordinates)
      fetchWeatherData(storedCoordinates.lat, storedCoordinates.lon)
    } else {
      // If not, get the coordinates using geolocation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords
            setCoordinates({ lat: latitude, lon: longitude })
            saveCoordinatesToStorage(latitude, longitude) // Store them in localStorage
            fetchWeatherData(latitude, longitude)
          },
          (error) => {
            console.error("Error getting location:", error.message)
          }
        )
      }
    }
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
