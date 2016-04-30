<?php
if(isset($_REQUEST))
{
	$connection = mysql_connect("localhost", "unlaze", "zQ3fxybe");
	mysql_select_db("unlaze-early-access", $connection);
	error_reporting(E_ALL && ~E_NOTICE);
	
	$first_name = $_POST['first_name'];
	$last_name = $_POST['last_name'];
	$gender = $_POST['gender'];
	$about = $_POST['about'];
	$birthday = $_POST['birthday'];
	$email = $_POST['email'];
	$cover = $_POST['cover'];
	$id = $_POST['id'];

	$sql = "INSERT INTO `facebook-signup` (first_name, last_name, gender, about, birthday, email, cover, id) VALUES ('$first_name', '$last_name', '$gender', '$about', '$birthday', '$email', '$cover', '$id')";
	$result = mysql_query($sql);
	if($result){
		echo "Registered!";
	} else {
		if (mysql_errno() == 1062) {
			echo "Already Registered!";
		} else {
			echo "Error.";//$sql . mysql_error();
		}
	}
}
?>