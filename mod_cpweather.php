<?php
defined('_JEXEC') or die;
$settings = json_decode(JModuleHelper::getModule('mod_cpweather')->params, true);
if(isset($_POST['mod_cpweather'])) {
	set_time_limit(3);
	require(__DIR__.'/src/shaledatamanager.lib.php');
	//Load weather from cache
	if(!empty($settings['wu_api_key']) && !empty($settings['wu_location'])) {
		$data = loadDB('cache');
		//If cache is not 346 seconds old use the cache
		if(isset($data['time']) && !empty($data['time']) && $data['time'] > time() - 346) {
			//Echo cache
			echo $data['weather'];
		} else { //Else grab new data from Weather Underground
			echo $settings['wu_api_key'];
			$apiUrl = 'http://api.wunderground.com/api/'.$settings['wu_api_key'].'/conditions/q/'.$settings['wu_location'].'.json';
			//Grab json
			$json = json_decode(file_get_contents($apiUrl))->current_observation;
			//Fix the icons because weather underground cant do thing right.
			$json->icon = str_replace('http://icons.wxug.com/i/c/k/','',str_replace('.gif','',$json->icon_url));
			$weather = json_encode($json);
			//Update cache
			putDB(array('time'=>time(), 'weather'=>$weather), 'cache');
			//Echo json
			echo $weather;
		}
	}
	exit;
}
echo '<style>'.$settings['custom_css'].'</style>';
echo file_get_contents(__DIR__.'/src/module.html');
?>