
const weather_img = document.querySelector('.weather-img');
const temperature = document.querySelector('.temperature');
const description = document.querySelector('.description');
const humidity = document.getElementById('humidity');
const wind_speed = document.getElementById('wind-speed');
const location_not_found = document.querySelector('.location-not-found');

const weather_body = document.querySelector('.weather-body');


function handleGetWeather(){
    // to do reset input filed  
    let getZip = document.getElementById("getZipCode").value;

  
    getWeather(getZip);
    
}

const getWeather = (getZip) =>{

  
    const apiKey = "3e81ecd6221cb9cff68b6d479698fe57";
   
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${getZip}&appid=${apiKey}`
    console.log(url);

    // create xmlhttp request
    let xhr = new  XMLHttpRequest();
    xhr.addEventListener("load", handleResponse);
    xhr.responseType = "json";
    // open connection
    xhr.open("GET", url);
    // send Data
    xhr.send();
    
};

function handleResponse(){

   let data = this.response;

   if(data.cod === `404`){
      location_not_found.style.display = "flex";
      weather_body.style.display = "none";
      console.log("error");
      return;
  }


 else if(data.cod === 200){
    // data receive here
    location_not_found.style.display = "none";
    weather_body.style.display = "flex";
  
    console.log(data);
    const city = data.name;
    const temp = data.main.temp;
    const dsc = data.weather[0].main
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    console.log(city, temp, dsc);
    temperature.innerHTML = `${Math.round(temp - 273.15)}°C`;
    description.innerHTML = `${dsc}`;

    humidity.innerHTML = `${humidity}%`;
    wind_speed.innerHTML = `${windSpeed}Km/H`;

    switch(dsc){
      case 'Clouds':
          weather_img.src = "/assets/cloud.png";
          break;
      case 'Clear':
          weather_img.src = "/assets/clear.png";
          break;
      case 'Rain':
          weather_img.src = "/assets/rain.png";
          break;
      case 'Haze':
          weather_img.src = "/assets/mist.png";
          break;
      case 'Snow':
          weather_img.src = "/assets/snow.png";
          break;
   
   }

    
 }else{
   console.log("error");
   
      
 }
 

 
 

} 
