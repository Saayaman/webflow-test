"use client"
import { useEffect, useState } from 'react';
import './page.css'
import locations from './cms/locations';

export default function Home() {
  const [popupOpen, setPopupOpen] = useState(false)

  useEffect(() => {
    windowOnLoad()
  }, [])

  function getLocationCookie() {
    const cookies = document.cookie.split('; '); // Split cookies by '; '
    for (let i = 0; i < cookies.length; i++) {
        const cookiePair = cookies[i].split('='); // Split each cookie into [key, value]
        if (cookiePair[0] === "location") {
            return decodeURIComponent(cookiePair[1]); // Return the value if the key matches
        }
    }
    return null; // Return null if the cookie isn't found
  }

  const updateLocation = (locationId) => {
    document.querySelectorAll('.location').forEach((div) => {
      div.classList.remove('visible');
    });

    const selectedDivs = document.querySelectorAll(`.location[data-location="${locationId}"]`);

    if (selectedDivs) {
      selectedDivs.forEach(div => {
         div.classList.add('visible'); // Do something with each div
      });
    }
  }

  const updateCookie = (dataLocationId) => {
    document.cookie = `location=${dataLocationId}`
  }

  

  const windowOnLoad = async() => {
    //Get Cookies
    const location = await getLocationCookie()
    console.log('location', location)
    if(!location) {
      console.log("location doesn't exist")
      // Get geolocation and set MB if in Manitoba
      const ipResponse = await fetch('https://get.geojs.io/v1/ip/geo.json');
      const data = await ipResponse.json();
      if(data.region === 'Manitoba') {
        updateCookie('winnipeg')
      } else {
        // Show location popup if it's not Manitoba
        const popup = document.getElementById("location-popup")
        popup.style.display = 'block'
        let elementsArray = document.querySelectorAll(".popup-item");
        console.log('elementsArray', elementsArray)
        elementsArray.forEach((elem) => {
            elem.addEventListener('click',(ev) => {
              const dataLocationId = elem.getAttribute('location-id')
              updateCookie(dataLocationId);
              updateLocation(dataLocationId);
              popup.style.display = "none"
            });
        });
      }
    } else {
      updateLocation(location)
    }
  }

  return (
    <div className='page'>
      <div className='container'>
        <header>
          <div className='header-top'>
            <div>Hive Icon</div>
          </div>
          <div className='header-bottom'>{locations.map(location => {
            return (
              <div key={`header-bottom-${location.locationId}`} className='location' data-location={location.locationId}>
                <div className='header-bottom-item'>
                  <div>{location.headerUpdate}</div>
                  <button>{location.name}</button>
                </div>
              </div>
            )
          })}</div>
        </header>
      </div>
      <div id='location-popup' className={`popup`}>
        <div className='popup-inner'>
          {locations.map(location => 
            <a location-id={location.locationId} key={`popup-${location.locationId}`} className='popup-item'>
              <div>
                <h3>{location.name}</h3>
              </div>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
