<?php
	$fileArray = array(
		"./index.html",
		"./css/main.css",
		"./js/main.js",
		"./database.php"
	);
	
	foreach ($fileArray as $value) {
		if (file_exists($value)) {
			unlink($value);
		} else {
			echo 'Done!';
		}
	}
?>