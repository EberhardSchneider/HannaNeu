<?php
session_start();
/* DATABASE CONFIGURATION */
// define('DB_SERVER', 'https://hannaherfurtner.de:3306/d02119e2');
// define('DB_USERNAME','d02119e2');
// define('DB_PASSWORD','castorp7');
// define('DB_DATABASE', 'hanna');
// define('BASE_URL','http://hannaherfurtner.de');

define('DB_SERVER', 'localhost');
define('DB_USERNAME','root');
define('DB_PASSWORD','root');
define('DB_DATABASE', 'hanna');
define('BASE_URL','localhost/workspace/HannaNeu');

function getDB() {
	$dbhost = DB_SERVER;
	$dbuser = DB_USERNAME;
	$dbpass = DB_PASSWORD;
	$dbname = DB_DATABASE;

	try {
		$dbConnection = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
		$dbConnection->exec("set names utf8");
		$dbConnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		return $dbConnection;
	}
	catch (PDOException $e) {
		echo 'Connection failed: ' . $e->getMessage();
	}

}
?>