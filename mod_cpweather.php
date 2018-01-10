<?php
defined('_JEXEC') or die;
$settings = json_decode(JModuleHelper::getModule('mod_cpweather')->params, true);
if(isset($_POST['mod_cpweather'])) {
	ob_clean();
	ob_start();
	require(__DIR__.'/src/shaledatamanager.lib.php');
	if(!empty($settings['wu_api_key']) && !empty($settings['wu_location'])) {
		$data = loadDB('cache');
		if(isset($data['time']) && !empty($data['time']) && $data['time'] > time() - 346) {
			echo $data['weather'];
		} else {
			$apiUrl = 'http://api.wunderground.com/api/'.$settings['wu_api_key'].'/conditions/q/'.$settings['wu_location'].'.json';
			ini_set('default_socket_timeout', 3);
			$response = @file_get_contents($apiUrl);
			if(!empty($response)) {
				$json = json_decode($response);
				if(isset($json->current_observation) && !empty($json->current_observation)) {
					$json->icon = str_replace('http://icons.wxug.com/i/c/k/','',str_replace('.gif','',$json->icon_url));
					$weather = json_encode($json->current_observation);
					putDB(array('time'=>time(), 'weather'=>$weather), 'cache');
					echo $weather;
				}
			} else {
				if(isset($data['weather']) && !empty($data['weather'])) {
					echo $data['weather'];
				} else {
					echo 'Empty response from WeatherUnderground. No valid data in cache to show.';
				}
			}
		}
	}
	exit;
}
echo '<style>'.$settings['custom_css'].'</style>';
echo file_get_contents(__DIR__.'/src/module.html');
?>