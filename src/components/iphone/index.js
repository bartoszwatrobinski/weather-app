// import preact
import { h, render, Component, withRouter } from 'preact';
import React from 'react';
// import stylesheets for ipad & button
import style from './style';
import style_iphone from '../button/style_iphone';
// import jquery for API calls
import $ from 'jquery';
// import the Button component
import Button from '../button';

export default class Iphone extends Component {
// var Iphone = React.createClass({
// a constructor with initial set states
constructor(props){
	super(props);
	// temperature state
	this.state.temp = "";
	// button display state
	this.setState({ display: true });
	this.handleClick = this.handleClick.bind(this);
	this.handleSubmit = this.handleSubmit.bind(this);
	this.url = null;
	this.setUrl("London");
	this.pageDetails = [];
}

// On submission of form
handleSubmit(event) {
	event.preventDefault();
	var location = event.target.location.value;
	console.log(location);
	this.setUrl(location);
	console.log("Successfully add " + event.target.location.value + " into pageDetails");
	console.log(this.pageDetails.length);
	console.log(this.pageDetails);
}

handleClick = () => {
	this.setState(prevState => ({
		isToggleOn: !prevState.isToggleOn
	}));
}

// return URL type given City as argument
setUrl = City => {
	var myUrl = new URL("http://api.openweathermap.org/geo/1.0/direct?q=?&appid=70a0a968dca5f59b098f6920801bd05b");
    myUrl.searchParams.set('q', City);

	// fetch data from URL
	$.ajax({
		url: myUrl,
		dataType: "jsonp",
		success:  this.parseResGeo,
		error: function (req, err) {
			console.log('API call failed ' + err);
		}
	})

}

parseResGeo = (parsed_json) => {
	console.log(parsed_json[0]);
	var lat = parsed_json[0]['lat'];
	var lon = parsed_json[0]['lon'];
	console.log(lat, lon);
	var returnUrl = new URL("https://api.openweathermap.org/data/2.5/onecall?lat=?&lon=?&appid=70a0a968dca5f59b098f6920801bd05b");
	returnUrl.searchParams.set('lat', lat);
	returnUrl.searchParams.set('lon', lon);
	console.log(returnUrl);
	this.url = returnUrl;

}

// a call to fetch weather data via wunderground
fetchWeatherData = () => {
document.getElementById("location").style.visibility = "visible";
document.getElementById("Warning").style.visibility = "visible";
document.getElementById("Search").style.visibility = "visible";
document.getElementById("CLD").style.visibility = "visible";
document.getElementById("calendar").style.visibility = "hidden";
document.getElementById("future").style.visibility = "hidden";

	// API URL with a structure of : ttp://api.wunderground.com/api/key/feature/q/country-code/city.json
	var url = this.url.href;
	this.pageDetails.push(this.url);
	$.ajax({
		url: url,
		dataType: "jsonp",
		success : this.parseResponse,
		error : function(req, err){
			console.log('API call failed ' + err);
			let Text =	document.getElementById("location");

			if (Text.value == ""){
				alert("Please enter a location");
			}

			else {
				alert("Not a valid location");
			}
		}
	})
	// once the data grabbed, hide the button
	this.setState({ display: false });
}

showForecast = () => {
	if (document.getElementById("location").style.visibility == "hidden"){
		document.getElementById("location").style.visibility = "visible";
		document.getElementById("Warning").style.visibility = "visible";
		document.getElementById("Search").style.visibility = "visible";
		document.getElementById("City").style.visibility = "visible";
		document.getElementById("Cond").style.visibility = "visible";
		document.getElementById("Temp").style.visibility = "visible";
		document.getElementById("calendar").style.visibility = "hidden";
	document.getElementById("future").style.visibility = "hidden";
	}

	else{
		document.getElementById("location").style.visibility = "hidden";
		document.getElementById("Warning").style.visibility = "hidden";
		document.getElementById("Search").style.visibility = "hidden";
		document.getElementById("City").style.visibility = "hidden";
		document.getElementById("Cond").style.visibility = "hidden";
		document.getElementById("Temp").style.visibility = "hidden";
		document.getElementById("calendar").style.visibility = "visible";
		document.getElementById("future").style.visibility = "visible";
	}
}


searchLocation = () => {
	let Text =	document.getElementById("location");
	this.setUrl(Text.value);
	this.fetchWeatherData();
}

// the main render method for the iphone component
render() {
	// check if temperature data is fetched, if so add the sign styling to the page
	const tempStyles = this.state.temp ? `${style.temperature} ${style.filled}` : style.temperature;

	const HandleClick = () =>{
		this.searchLocation();
	}

	// display all weather data
	return (
		<div id="background" class={ style.container }>
			<div class={ style.header }>
				<div id="City" class={ style.city }>{ this.state.locate }</div>
				<div id="Cond" class={style.conditions}>{this.state.cond}</div>
				<span id="Temp" class={tempStyles}>{this.state.temp}</span>
					<div id="Warning" class={style.warning}>
						<p id={style.warningtext}>WEATHER WARNINGS</p>
						<div id={style.info}>
							<figure>
								<img src={"../../assets/icons/temp.png"} width="40" height="40"  alt="Logo" />
								<figcaption>{this.state.tempmessage}</figcaption>
							</figure>
							<figure>
								<img src={"../../assets/icons/humid.png"} width="40" height="40" alt="Logo" />
								<figcaption>{this.state.humid}</figcaption>
							</figure>
							<figure>
								<img src={"../../assets/icons/windspd.png"} width="40" height="40" alt="Logo" />
								<figcaption>{this.state.windsp}</figcaption>
							</figure>
						</div>
					</div>
			</div>
			<div class={style.details}></div>
			<div class= { style_iphone.container }>
				{ this.state.display ? <Button class={ style_iphone.button } clickFunction={ this.fetchWeatherData }/ > : null }
			</div>
				<div class={ style.calendar } id = "calendar">
					<div class={ style.future } id = "future">
						<div id="Monday" class = { style.day }>Monday</div>
						<img src={ this.state.icon0 } class= "icon" ></img>
						<div class = { style.temperatures }>
							<div class = "temperature1">Day - { this.state.dayTemp0 }°C</div>
							<div class = "temperature2">Night - { this.state.nightTemp0 }°C</div>
						</div>
					</div>	
					<div class={ style.future } id = "future">
						<div id="Tuesday" class = { style.day }>Tuesday</div>
						<img src={ this.state.icon1 } class= "icon" ></img>
						<div class = { style.temperatures }>
							<div class = "temperature1">Day - { this.state.dayTemp1 }°C</div>
							<div class = "temperature2">Night - { this.state.nightTemp1 }°C</div>
						</div>
					</div>
					<div class={ style.future } id = "future">
						<div id="Wednesday" class = { style.day }>Wednesday</div>
						<img src={ this.state.icon2 } class= "icon" ></img>
						<div class = { style.temperatures }>
							<div class = "temperature1">Day - { this.state.dayTemp2 }°C</div>
							<div class = "temperature2">Night - { this.state.nightTemp2 }°C</div>
						</div>
					</div>
					<div class={ style.future } id = "future">
						<div id="Thursday" class = { style.day }>Thursday</div>
						<img src={ this.state.icon3 } class= "icon" ></img>
						<div class = { style.temperatures }>
							<div class = "temperature1">Day - { this.state.dayTemp3 }°C</div>
							<div class = "temperature2">Night - { this.state.nightTemp3 }°C</div>
						</div>
					</div>
					<div class={ style.future } id = "future">
						<div id="Friday" class = { style.day }>Friday</div>
						<img src={ this.state.icon4 } class= "icon" ></img>
						<div class = { style.temperatures }>
							<div class = "temperature1">Day - { this.state.dayTemp4 }°C</div>
							<div class = "temperature2">Night - { this.state.nightTemp4 }°C</div>
						</div>
					</div>
					<div class={ style.future } id = "future">
						<div id="Saturday" class = { style.day }>Saturday</div>
						<img src={ this.state.icon5 } class= "icon" ></img>
						<div class = { style.temperatures }>
							<div class = "temperature1">Day - { this.state.dayTemp5 }°C</div>
							<div class = "temperature2">Night - { this.state.nightTemp5 }°C</div>
						</div>
					</div>
					<div class={ style.future } id = "future">
						<div id="Sunday" class = { style.day }>Sunday</div>
						<img src={ this.state.icon6 } class= "icon" ></img>
						<div class = { style.temperatures }>
							<div class = "temperature1">Day - { this.state.dayTemp6 }°C</div>
							<div class = "temperature2">Night - { this.state.nightTemp6 }°C</div>
						</div>
					</div>
				</div>			
			<div id="Search" class={style.search} >
				<input id="location"  placeholder="Location" type="text" name="location"/>
				<button onClick={HandleClick} id={style.SearchButton}>Search</button>
			</div>
			<img id="CLD" class={style.cldButton} src={"../../assets/icons/calendar.png"} onClick={this.showForecast} alt="Logo" />
		</div >
	);
}

parseResponse = (parsed_json) => {
	var rainBool = 0;
	const dayTemps = [];
	const nightTemps = [];
	const icons = [];
	var location = parsed_json['timezone'];
	var temp_c = parsed_json['current']['temp'];
	var conditions = parsed_json['current']['weather']['0']['description'];
	var humidity = parsed_json['current']['humidity']
	var windspeed = parsed_json['current']['wind_speed'];

	if (parsed_json['current']['weather']['0']['main'] == 'Rain') {
		rainBool = 1;
	};

	var rainTime = 0;

	for (let i = 0; i < 12; i++) {
		if (parsed_json['hourly'][i]['weather']['0']['main'] == 'Rain') {
			rainBool = 1;
			if (rainTime == 0) {
				var rainTime = i;
			};
		};
	};

	this.setState({ rain: 'no rain due' });

	if (rainBool == 1) {
		this.setState({ rain: 'rain in ' + rainTime + ' hours' });
	};

	for(let i=0;i<7;i++){
		dayTemps[i] = parsed_json['daily'][i]['temp']['day'];
		nightTemps[i] = parsed_json['daily'][i]['temp']['night'];
		icons[i] = parsed_json['daily'][i]['weather']['0']['icon'];
		//console.log(parsed_json['daily'][i]['weather']['0']['icon']);
	}

	var tempmessage;
	var humimessage;
	var windspmessage;

	if (temp_c < 10.0){
		tempmessage = "Warning! Temperature below 10°C, Low temperature can stunt plant growth.";
	}

	else if (temp_c > 32.2) {
		tempmessage = " Warning! Temperature above 32.3°C, High temperature reduces the rate of photosynthesis, which damages the plant.";
	}

	else{
		tempmessage = "Temperature at " + temp_c + "°C. Positive effect on plants."
	}

	if (humidity < 50.0){
		humimessage = "Warning! Low Humidity levels below 50%, This can cause your plant to dry up. You should mist your plants.";
	}

	else if (humidity > 85.0) {
		humimessage = "Warning! High Humidity levels above 85%, This can obstruct plants from drawing nutrients from the soil.";
	}

	else{
		humimessage ="Humidity levels at " + humidity + "%. Positive effect on plants."
	}

	if (windspeed > 13.4 ){
		windspmessage = "Warning! Strong Winds can be physically damaging to your plants.";
	}

	else{
		windspmessage = "Wind speeds at " + windspeed + "m/s. No effect on plants."
	}

	if (conditions.includes("haze") || conditions.includes("atmosphere") || conditions.includes("mist") || conditions.includes("fog")){
		document.getElementById("background").style.background = "url('../../assets/backgrounds/atmosphere.png')"
	}

	else if (conditions.includes("clear") || conditions.includes("sun")) {
		document.getElementById("background").style.background = "url('../../assets/backgrounds/clear.png')"
	}

	else if (conditions.includes("drizzle") || (conditions.includes("light") && conditions.includes("rain")) ) {
		document.getElementById("background").style.background = "url('../../assets/backgrounds/drizzle.png')"
	}

	else if (conditions.includes("cloud")) {
		document.getElementById("background").style.background = "url('../../assets/backgrounds/fewclouds.png')"
	}

	else if (conditions.includes("rain")) {
		document.getElementById("background").style.background = "url('../../assets/backgrounds/rain.png')"
	}

	else if (conditions.includes("snow") || conditions.includes("blizzard")) {
		document.getElementById("background").style.background = "url('../../assets/backgrounds/snow.png')"
	}

	else if (conditions.includes("storm") || conditions.includes("thunder")) {
		document.getElementById("background").style.background = "url('../../assets/backgrounds/thunderstorm.png')"
	}
	else{
		document.getElementById("background").style.background = "url('../../assets/backgrounds/fewclouds.png')"
	}

	// set states for fields so they could be rendered later on
	this.setState({
		locate: location,
		temp: Math.round(temp_c-273.15),
		tempmessage: tempmessage,
		cond: conditions,
		windsp: windspmessage,
		humid: humimessage,
		dayTemp0: Math.round(dayTemps[0]-273.15),
		dayTemp1: Math.round(dayTemps[1]-273.15),
		dayTemp2: Math.round(dayTemps[2]-273.15),
		dayTemp3: Math.round(dayTemps[3]-273.15),
		dayTemp4: Math.round(dayTemps[4]-273.15),
		dayTemp5: Math.round(dayTemps[5]-273.15),
		dayTemp6: Math.round(dayTemps[6]-273.15),
		nightTemp0: Math.round(nightTemps[0]-273.15),
		nightTemp1: Math.round(nightTemps[1]-273.15),
		nightTemp2: Math.round(nightTemps[2]-273.15),
		nightTemp3: Math.round(nightTemps[3]-273.15),
		nightTemp4: Math.round(nightTemps[4]-273.15),
		nightTemp5: Math.round(nightTemps[5]-273.15),
		nightTemp6: Math.round(nightTemps[6]-273.15),
		icon0: "http://openweathermap.org/img/wn/" + icons[0] + "@2x.png",
		icon1: "http://openweathermap.org/img/wn/" + icons[1] + "@2x.png",
		icon2: "http://openweathermap.org/img/wn/" + icons[2] + "@2x.png",
		icon3: "http://openweathermap.org/img/wn/" + icons[3] + "@2x.png",
		icon4: "http://openweathermap.org/img/wn/" + icons[4] + "@2x.png",
		icon5: "http://openweathermap.org/img/wn/" + icons[5] + "@2x.png",
		icon6: "http://openweathermap.org/img/wn/" + icons[6] + "@2x.png"
	});

}

}
