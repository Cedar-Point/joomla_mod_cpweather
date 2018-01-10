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
					if(validJson && typeof json['local_time_rfc822'] == 'string') {
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
$('#mod_cpweather').attr('title', `
Last updated: `+weath['local_time_rfc822']+`
UV Index: `+weath.UV+`
Humidity: `+weath['relative_humidity']+`
Pressure: `+weath['pressure_mb']+`mb
Visibility: `+weath['visibility_mi']+`mi
Heat Index: `+weath['heat_index_string']+`
Wind Chill: `+weath['windchill_string']+`
`);
				$('#mod_cpweather a').attr('href', weath['forecast_url']);
				$('#mod_cpweather .wico').addClass(weath.icon);
				$('#mod_cpweather .weather_temp').html(weath.weather+' '+weath['temp_f']+'&deg;');
				$('#mod_cpweather .feels_like').html('Feels like '+weath['feelslike_f']+'&deg;');
				$('#mod_cpweather .wind_direction').html('Wind '+weath['wind_dir']+' at '+weath['wind_mph']+'mph');
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