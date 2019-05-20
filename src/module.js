(function() {
	var $ = jQuery;
	$(document).ready(function() {
		function refresh() {
			if(typeof localStorage.weather == 'string' && localStorage.weather !== '' && typeof localStorage.weather_time == 'string' && localStorage.weather_time > Math.round((new Date()).getTime() / 1000) - 180) {
				try {
					var json = JSON.decode(localStorage.weather);
					var validJson = true;
				} catch(e) {
					var validJson = false;
				}
				if(validJson) {
					render(json);
				} else {
					delete localStorage.weather;
					delete localStorage.weather_time;
					setTimeout(refresh, 3000);
				}
			} else {
				$.post('./', {mod_cpweather:''}, function(data) {
					try {
						var json = JSON.decode(data);
						var validJson = true;
					} catch(e) {
						var validJson = false;
					}
					if(validJson && typeof json['currently'] == 'object') {
						localStorage.setItem('weather', data);
						localStorage.setItem('weather_time', Math.round((new Date()).getTime() / 1000));
						render(json);
					} else {
						 $('#mod_cpweather .loading').hide();
					}
				}).fail(function() {
					setTimeout(refresh, 3000);
				});
			}
		};
		function render(weath) {
			try {
				var current = weath.currently;
$('#mod_cpweather').attr('title',
'Last Updated: '+new Date(current.time * 1000)+
'\nUV Index: '+current.uvIndex+
'\nHumidity: '+current.humidity+
'\nPressure: '+current.pressure+'mb'+
'\nVisibility: '+current.visibility+'mi'+
'\nWind Bearing: '+current.windBearing+'deg'+
'\nWind Gusts: '+current.windGust+'mph'+
'\nPrecipitation Probability: '+current.precipProbability+'%'+
'\nNearest Storm: '+current.nearestStormDistance+'mi'
);
				$('#mod_cpweather a').attr('href', 'https://darksky.net/forecast/'+weath.latitude+','+weath.longitude);
				$('#mod_cpweather .wico').addClass(current.icon);
				$('#mod_cpweather .weather_temp').html(current.summary+' '+Math.round(current.temperature)+'&deg;');
				$('#mod_cpweather .feels_like').html('Feels like '+Math.round(current.apparentTemperature)+'&deg;');
				$('#mod_cpweather .wind_direction').html('Wind speed '+Math.round(current.windSpeed)+'mph');
				$('#mod_cpweather .mod').show();
				$('#mod_cpweather .loading').hide();
			} catch(e) {
				console.error(e);
				setTimeout(refresh, 3000);
			}
		};
		setInterval(function() {
			refresh();
		}, 300000);
		refresh();
	});
})();