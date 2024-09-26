import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Http } from "@capacitor/http";
import { Device } from "@capacitor/device";
import { ArrowLeft, CloudDownload } from "@mui/icons-material";


const DownloadApp = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const navigate = useNavigate();
  const [isIOSApp, setIsIOSApp] = useState(false)

  useEffect(() => {
    const checkDevice = async () => {
      const info = await Device.getInfo()
      if (info.platform === "ios") {
        setIsIOSApp(true)
      } else {
        setIsIOSApp(false)
      }
    }
    checkDevice()
  }, [])

  const handleDownload = async () => {
    setIsDownloading(true);
    const info = await Device.getInfo()
    try {
      if (info.platform === 'ios') {
        await downloadFileForiOS();
      } else {
        // For web apps, we can use the regular browser download
        const link = document.createElement('a');
        link.href = '/expenser.apk';
        link.setAttribute('download', 'expenser.apk');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Error downloading the file:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  // Function to download the file using Capacitor for iOS
  const downloadFileForiOS = async () => {
    try {
      // Make the HTTP GET request to download the file
      const response = await Http.request({
        method: 'GET',
        url: `${window.location.origin}/expenser.apk`,  // Use the correct file URL
        headers: {
          // Add any required headers here
          'Content-Type': 'application/octet-stream',
        }
      });
  
      // Convert response.data (binary data in the form of a string) to ArrayBuffer
      const arrayBuffer = stringToArrayBuffer(response.data);
  
      // Convert ArrayBuffer to base64 to store it using Capacitor Filesystem plugin
      const base64Data = arrayBufferToBase64(arrayBuffer);
  
      // Write the file to the iOS filesystem
      await Filesystem.writeFile({
        path: 'expenser.apk',
        data: base64Data,
        directory: Directory.Documents,  // Adjust to Documents directory on iOS
      });
  
      console.log('File saved successfully to Documents folder');
      alert('File downloaded successfully! Check your Documents folder.');
  
    } catch (error) {
      console.error('Failed to download file for iOS:', error);
      alert('Failed to download the file. Please try again.');
    }
  };
  
  // Function to convert string response data into ArrayBuffer
  const stringToArrayBuffer = (data: string) => {
    const buf = new ArrayBuffer(data.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = data.length; i < strLen; i++) {
      bufView[i] = data.charCodeAt(i);
    }
    return buf;
  };
  
  // Function to convert ArrayBuffer to base64
  const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);  // Convert binary string to base64
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 text-white bg-gray-900">
      <div className="w-full max-w-md p-6 text-center bg-gray-800 rounded-lg shadow-lg">
        <button
          onClick={() => navigate("/")}
          className="flex items-center p-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600"
          style={{
         paddingTop: isIOSApp && 'env(safe-area-inset-top)'
          }}
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          <span className="hidden sm:block">Home</span>
        </button>

        <h1 className="mt-5 mb-4 text-3xl font-bold">Download Our App</h1>
        <p className="mb-6 text-base sm:text-lg">
          Download the latest version of our app and manage your expenses on the go.
        </p>

        <div className="mb-6">
          <img
            src="/logo.png" // Add your mockup image here
            alt="App Mockup"
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>

        <button
          className={`flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out ${
            isDownloading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleDownload}
          disabled={isDownloading}
        >
          <CloudDownload className="w-6 h-6 mr-2" />
          {isDownloading ? "Downloading..." : "Download APK"}
        </button>

        {isDownloading && (
          <p className="mt-2 text-sm text-gray-400">Your download will start shortly...</p>
        )}
      </div>
    </div>
  );
};

export default DownloadApp;
