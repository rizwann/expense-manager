import { ArrowLeft, CloudDownload } from "@mui/icons-material"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const DownloadApp = () => {
  const [isDownloading, setIsDownloading] = useState(false)
  const navigate = useNavigate()

  const handleDownload = () => {
    setIsDownloading(true)
    setTimeout(() => {
      setIsDownloading(false)
    }, 2000)
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen p-4 text-white bg-gray-900"
    style={{
    }}
    >
      <button
        onClick={() => navigate("/")}
        className="absolute flex items-center p-2 text-white bg-gray-700 rounded-lg top-4 left-4 hover:bg-gray-600"
      >
        <ArrowLeft className="w-5 h-5 mr-1" />
        <span className="hidden sm:block">Back to Home</span>
      </button>
      <div className="w-full max-w-md p-6 text-center bg-gray-800 rounded-lg shadow-lg">
        <h1 className="mb-4 text-3xl font-bold">Download Our App</h1>
        <p className="mb-6 text-base sm:text-lg">
          Download the latest version of our app and manage your expenses on the
          go.
        </p>

        <div className="mb-6">
          <img
            src="/logo.png"
            alt="App Mockup"
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>
        <a
          href="https://download944.mediafire.com/tnl0cbjuy6ogWGRAVaHPwksQ-Elb0ZBWk0xYgg-Z07t-Y0EhX55mqzBeySU6281OQCjBiL1iNMM7RAnckta9FRzKajQ3f72p6NJJ8_ZjOBH3qe9X1YqXPGHCFFaDMD0RF_NXIO2OKNRMdkR_dDSrbMQGbA7SYPQd2LkxP332T-HB/hdnskqqfooguvou/expenser.apk"
          download
          className={`flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out ${
            isDownloading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleDownload}
        >
          <CloudDownload className="w-6 h-6 mr-2" />
          {isDownloading ? "Downloading..." : "Download APK"}
        </a>

        {isDownloading && (
          <p className="mt-2 text-sm text-gray-400">
            Your download will start shortly...
          </p>
        )}
      </div>
    </div>
  )
}

export default DownloadApp
