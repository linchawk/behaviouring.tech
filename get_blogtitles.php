<?php
	require_once("db_connection.php");

	function get_allblogtitles() {
		global $conn;		
		$sql = "SELECT title FROM `Thoughts` ORDER BY date DESC";
		$result = $conn->query($sql);
		$returnjson = array();
		$returnjson["titles"] = array();

		if ($result->num_rows > 0) {		   
		    while($row = $result->fetch_assoc()) {
		        array_push($returnjson["titles"], utf8_encode($row["title"]));
		    }
		}
		echo json_encode($returnjson, JSON_PRETTY_PRINT);
	}

	connect_db();
	get_allblogtitles();
	disconnect_db();
?>