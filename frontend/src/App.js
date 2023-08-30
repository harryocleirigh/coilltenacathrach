import './App.css';
import Map from './components/Map';
import MobileMap from './components/MobileMap';

function App() {

  const isMobileDevice = () => {
    return (typeof window.orientation !== "undefined") && (window.innerWidth < 541);
  };


  return (
    <div>
        {isMobileDevice() ? <MobileMap /> : <Map />}
    </div>
  );
}

export default App;
