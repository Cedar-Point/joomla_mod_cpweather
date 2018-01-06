<?php
defined('_JEXEC') or die;
require(__DIR__.'/src/shaledatamanager.lib.php');

print_r(json_decode(JModuleHelper::getModule('mod_cpweather')->params, true));
?>