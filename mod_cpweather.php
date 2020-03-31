<?php
defined('_JEXEC') or die;
$settings = json_decode(JModuleHelper::getModule('mod_cpweather')->params, true);
if(isset($_POST['mod_cpweather'])) {
    while(ob_get_level() !== 0) {
        ob_end_clean();
    }
    require(__DIR__.'/src/shaledatamanager.lib.php');
    if(!empty($settings['wu_api_key']) && !empty($settings['wu_location'])) {
        $data = loadDB('cache');
        if(isset($data['time']) && !empty($data['time']) && $data['time'] > time() - 346) {
            echo $data['weather'];
        } else {
            $apiUrl = 'https://api.darksky.net/forecast/'.$settings['wu_api_key'].'/'.$settings['wu_location'];
            ini_set('default_socket_timeout', 3);
            $response = file_get_contents($apiUrl, false, stream_context_create(
                array(
                    'ssl' => array(
                        'verify_peer' => false,
                        'verify_peer_name' => false,
                    )
                )
            ));
            if(!empty($response)) {
                $json = json_decode($response);
                $weather = json_encode($json);
                putDB(array('time'=>time(), 'weather'=>$weather), 'cache');
                echo $weather;
            } else {
                if(isset($data['weather']) && !empty($data['weather'])) {
                    echo $data['weather'];
                } else {
                    echo '<br><br>Cannot serve old cache, and invalid or empty response from DarkSky: '.$response.'.';
                }
            }
        }
    }
    exit;
}
echo '<style>'.$settings['custom_css'].'</style>';
echo file_get_contents(__DIR__.'/src/module.html');
?>
