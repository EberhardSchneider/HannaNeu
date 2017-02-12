<?php
	
	$host = "localhost";
	$user = "root";
	$password = "root";
	$link = "d02119e2";


	$db = mysqli_connect( $host, $user, $password, $link ) or die(mysqli_error());
	

	$db->select_db("hanna");
?>