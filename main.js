
const searchButton = document.getElementById("searchButton")
const frontPage = document.getElementById('frontPage')
searchButton.addEventListener('click',addLoading)
const aboutParkName = document.getElementById('parkName')

const cardSection = document.getElementById("cardSection")
const currentWeather = document.getElementById('currentWeather')
const maxWeather = document.getElementById('maxWeather')
const minWeather = document.getElementById('minWeather')

const weatherIconText = document.getElementById('weatherIconText')
const forecastImg = document.getElementById('forecastImg')

const parkPage = document.getElementById('parkPage')
const parkInfo= document.getElementById('parkInfo')

const nameOfCity = document.getElementById('nameOfCity')
const moreInfo = document.getElementById('moreInfo')
const activTitle = document.getElementById('activTitle')
const linkToUrl = document.getElementById('linkToUrl')
const tenDayWeather = document.getElementById("tenDayWeather")
$('.sk-chase').hide()

function addLoading(){
  $('.sk-chase').show()
  $('.main').hide()
  getParkList()
}
function getParkList(){
  const inputField = document.getElementById("inputField")
  const state = inputField.value;
  $.ajax({
    method: "GET",
    url: "https://developer.nps.gov/api/v1/parks?stateCode=" + state + "&api_key=dI78ci2wrHGtsbYSYfGzs5d4kgbVX8KZODm1zstV",
    success: parks => {
      $('.sk-chase').hide()
      getList(parks)
    },
    error: error => {
      console.log(error)
    }
  })
}

function getList(parks) {
  frontPage.setAttribute("class", "display")
  var getlist = parks.data
  //tableBody.textContent = ''

  for (let i = 0; i < getlist.length; i++) {
    const cardDiv = document.createElement('div')
    cardDiv.setAttribute("class", "card")
    cardDiv.style.width = "18rem"
    const img = document.createElement('img')
    const url = getlist[i].images[0].url
    img.setAttribute('src', url)
    img.setAttribute('class', 'card-img-top')
    const cardBodyDiv = document.createElement('div')
    cardBodyDiv.setAttribute('class', 'card-body')
    const cardTitle = document.createElement('h5')
    cardTitle.setAttribute('class', 'card-title')
    cardTitle.textContent = getlist[i].fullName
    // const cardContent = document.createElement('p')
    // cardContent.setAttribute('class', 'card-text')
    // cardContent.textContent = "paragraph"
    const button = document.createElement('button')
    button.setAttribute('class', 'btn btn-primary')
    button.textContent = "Let's Go"
    button.setAttribute('id', getlist[i].parkCode)

    cardSection.append(cardDiv)
    cardDiv.append(img, cardBodyDiv)
    cardBodyDiv.append(cardTitle, button)

    button.addEventListener("click", getPark)

  }
    function getPark() {
    cardSection.setAttribute('class','display')
    console.log("this is the Park id: " +this.id)
    var parkId = this.id
    //console.log(parkId)
    getActivities(parkId)
    }
  }
function getActivities(parkIdParameter){
  const letsGoButton = parkIdParameter
    $.ajax({
      method: "GET",
      url: "https://developer.nps.gov/api/v1/parks?parkCode=" + letsGoButton + "&api_key=dI78ci2wrHGtsbYSYfGzs5d4kgbVX8KZODm1zstV",
      success:
        parks => {
          //console.log(parks.data)
          getListOfActivities(parks)
        },
      error: error => {
        console.log(error)
      }
    })
  }

 function getListOfActivities(parks){
   const activities = parks.data[0].activities
   const description = parks.data[0].description
   const cityName = parks.data[0].addresses[0].city
   aboutParkName.textContent = parks.data[0].fullName
   //console.log(activities)
   const paragraph = document.createElement('p')
   paragraph.textContent = description
   paragraph.setAttribute("class","city")
   paragraph.setAttribute("id", cityName)
   const ulList = document.createElement('ul')
   parkInfo.append(paragraph)
   activTitle.append(ulList)

   for(let i=0; i<activities.length; i++){
     const list = document.createElement('li')
     list.textContent = parks.data[0].activities[i].name
     ulList.append(list)
     linkToUrl.textContent =parks.data[0].url


     linkToUrl.setAttribute('href',parks.data[0].url)
     moreInfo.append(linkToUrl)
   }
   getWeather()
}


function getWeather() {
  const getCityName = document.getElementsByClassName("city")[0].id
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q="+getCityName+"&units=imperial&appid=44c444f17511a8bb6a7a59dcf93e8f54",
    success: data => {
      //console.log(data.main.temp)
      parkPage.classList.remove("display")
      nameOfCity.textContent = getCityName
      renderCurrentWeather(data)
    },
    error: error => {
      console.log(error)
    }

  })
}

function renderCurrentWeather(data){
  currentWeather.textContent = Math.floor(data.main.temp) + " °F"
  maxWeather.textContent = Math.floor(data.main.temp_max) + " °F"
  minWeather.textContent = Math.floor(data.main.temp_min) + " °F"

  weatherIconText.setAttribute('class', data.weather[0].icon)
  const currentWeatherId = weatherIconText.getAttribute('class')

  const forecastRn = document.createElement('img')
  forecastRn.setAttribute('src', 'http://openweathermap.org/img/wn/' + currentWeatherId + '@2x.png')

  forecastImg.append(forecastRn)
  var latitude = data.coord.lat
  var longitude = data.coord.lon

  getSevenDayWeather(latitude, longitude)
}

function getSevenDayWeather(lat,long){

  $.ajax({
    method:"GET",
    url: "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+long+"&exclude=current,minutely,hourly&units=imperial&appid=44c444f17511a8bb6a7a59dcf93e8f54",
    success:data=>{
      //console.log(data.daily[0].weather[0].main)
      console.log(data)
      renderSevenDayWeather(data)
    },
    error:error=>{
      console.log(error)
    }
  })
}


function renderSevenDayWeather(data){
  for (let i=0;i<data.daily.length; i++){
    const eachDayWeather = document.createElement('tr')
    const max10Weather =document.createElement('td')
    max10Weather.textContent = Math.floor(data.daily[i].temp.max) + "°F"
    const min10Weather= document.createElement('td')
    min10Weather.textContent = Math.floor(data.daily[i].temp.min) + "°F"
    const weatherCondition = document.createElement('td')
    weatherCondition.textContent = data.daily[i].weather[0].main
    const dayofWeather =document.createElement('td')

    var day = new Date((data.daily[i].dt) * 1000)
    var dayArray =['Sun','Mon','Tue','Wed','Thur','Fri','Sat','Sun']
    var getDay = dayArray[day.getDay()]
    dayofWeather.textContent = getDay
    const weatherIcon = document.createElement('td')
    const weatherIconImg = document.createElement('img')
    weatherIcon.setAttribute('id', data.daily[i].weather[0].icon)


     var weatherId = weatherIcon.getAttribute('id')
    weatherIconImg.setAttribute('src', 'http://openweathermap.org/img/wn/'+weatherId+'@2x.png')


    eachDayWeather.append(dayofWeather,max10Weather,min10Weather,weatherCondition,weatherIcon)
    tenDayWeather.append(eachDayWeather)
    weatherIcon.append(weatherIconImg)

  }
}
