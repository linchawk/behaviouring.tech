<?php	
	$conn;	

	function main() {
		$servername = "localhost";
		$username = "behaviou_mohan";
		$password = "13.5billion";
		$dbname = "behaviou_experiments";
		global $conn;

		// Create connection
		$conn = new mysqli($servername, $username, $password, $dbname);

		// Check connection
		if ($conn->connect_error) {
		    die("Some internal error occured.");
		}

		$blogtitle = $_GET["title"];

		if($blogtitle == "")
			get_allblogtitles();
		else
			get_blogbytitle(urldecode($blogtitle));

		$conn->close();
	}

	function get_allblogtitles() {
		global $conn;		
		$sql = "SELECT title FROM `Thoughts` ORDER BY date DESC";
		$result = $conn->query($sql);

		if ($result->num_rows > 0) {
		    // output data of each row
		    while($row = $result->fetch_assoc()) {
		    	//echo "<a href=\"/blog.php?title=" . urlencode($row["title"]). "\">" . $row["title"]. "</a>" . "<br>";
		        echo "<a href=\"/blog/" . urlencode($row["title"]). "\">" . $row["title"]. "</a>" . "<br>";
		    }
		} else {
		    echo "0 results";
		}
	}

	function get_blogbytitle($blogtitle) {
		global $conn;
		$sql = "SELECT * FROM `Thoughts` WHERE title='" . $blogtitle . "'";
		$result = $conn->query($sql);

		if ($result->num_rows > 0) {
		    // output data of each row
		    while($row = $result->fetch_assoc()) {
		        echo "<b>" . $row["title"] . "</b><p>" . $row["date"] . "</p><p>" . $row["content"] . "</p>";
		    }
		} else {
		    echo "Could not find article.";
		}
	}		

	main();
?>