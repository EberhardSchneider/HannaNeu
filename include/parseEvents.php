<?php
	
$events = file_get_contents("events.json");
$jsonIterator = new RecursiveIteratorIterator(
    new RecursiveArrayIterator(json_decode($events, TRUE)),
    RecursiveIteratorIterator::SELF_FIRST);




include 'connect.php';



mysqli_query($db, 'SET NAMES utf-8');


$mysql = '';
$index = 0;

foreach ($jsonIterator as $key => $value) {
	

}

print($mysql);



mysqli_close( $db );?>

*/