<?php
	require_once("db_connection.php");

	function get_blogbytitle($blogtitle) {
		global $conn;
		$sql = "SELECT * FROM `Thoughts` WHERE title='" . $blogtitle . "'";
		$result = $conn->query($sql);
		$returnjson = array();	
		$returnjson["blog"]	= array();
		if ($result->num_rows > 0) {
		    // output data of each row
		    while($row = $result->fetch_assoc()) {
		    	$row["title"] = utf8_encode($row["title"]);
		    	$row["content"] = utf8_encode($row["content"]);		    	
		    	$row["date"] = date('jS F Y', strtotime($row["date"]));
		    	$returnjson["blog"][] = $row;		    	
		    }
		} else {
		    //$returnjson["blog"] = "";
		}
		echo json_encode($returnjson, JSON_PRETTY_PRINT);		
	}

	connect_db();
	get_blogbytitle(urldecode($_GET["title"]));
	disconnect_db();
?>