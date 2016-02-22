<?php
	
	$host = "localhost";
	$user = "d02119e2";
	$password = "castorp7";
	$link = "d02119e2";


	$db = mysqli_connect( $host, $user, $password, $link ) or die(mysqli_error());
	

	$db->select_db("hanna");
?>