import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './toastStyles.scss'; // Custom styles

const Toaster = () => (
  <ToastContainer
    position="top-right"
    autoClose={4000}
    hideProgressBar
    newestOnTop
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="dark"
    icon={false} // Disable default icon
    toastClassName="custom-toast" // Custom class for toasts
    bodyClassName="custom-toast-body" // Custom class for the toast body
  />
);

export default Toaster;
