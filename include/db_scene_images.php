<?php
	
include 'connect.php';



mysqli_query($db, 'SET NAMES utf-8');


$result = $db->query("SELECT * FROM bilder");


$index = 0;
$bilder = array();

while ( $dsatz = $result->fetch_assoc() ) {
	
	$bilder[$index] = $dsatz;
	$index++;
}

function encode_items(&$item, $key) // Umlaute behandeln
{
    $item = utf8_encode($item);
}
array_walk_recursive($bilder, 'encode_items');

print json_encode( $bilder );

mysqli_close( $db );?>