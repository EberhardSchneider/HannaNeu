<?php 
ini_set("display_errors", true);
date_default_timezone_set( "Europe/Berlin");
define( "DB_DSN", "mysql:host=localhost;dbname=d02119e2");
define( "DB_USERNAME" , "root" ); //d02119e2
define( "DB_PASSWORD" , "root" );
define( "CLASS_PATH", "classes" );
define( "TEMPLATE_PATH", "templates" );
define( "ADMIN_USERNAME", "hanna" );
define("ADMIN_PASSWORD", "hanna" );

require( CLASS_PATH . "/Event.php");

 ?>