<?php
	$conn;	

	function connect_db() {
		$servername = "localhost";
		$username = "";
		$password = "";
		$dbname = "behaviou_experiments";
		global $conn;

		// Create connection
		$conn = new mysqli($servername, $username, $password, $dbname);

		// Check connection
		if ($conn->connect_error) {
		    die("Some internal error occured.");
		}
	}

	function disconnect_db() {
		global $conn;
		$conn -> close();
	}
?>