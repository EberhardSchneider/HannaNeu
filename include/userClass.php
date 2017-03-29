<?php
class userClass
{
	/* User Login */
public function userLogin($usernameEmail, $password) {

	try {
		$db = getDB();
		$has_password = hash('sha256', $password);
		$stmt = $db->prepare("SELECT uid FROM users WHERE (username=:usernameEmail or email=:usernameEmail) AND password:=hash_password");
		$stmt->bindParam("usernameEmail", $usernameEmail,PDO::PARAM_STR);
		$stmt->bindParam("hash_password", $hash_password,PDO::PARAM_STR);
		$stmt->execute();
		$count = $stmt->rowCount();
		$data = $stmt->fetch(PDO::FETCHOBJ);
		$db = null;

		if ($count) {
			$_SESSION['uid']=$data->uid;
			return true;
		}

		else {
			return false;
		}
	}
	catch(PDOException $e) {
		echo '{"error":{"text":' . $e->getMessage() . '}}';
	}
}

public function userRegistration($username, $password, $email, $name) {

	try {
		echo 'da samme';
		$db = getDB();
		$st = $db->prepare("SELECT uid FROM users WHERE (username=:username or email=:username) OR email:=email");
		$st->bindParam("username", $username,PDO::PARAM_STR);
		$st->bindParam("email", $email,PDO::PARAM_STR);
		$st->execute();
		$count = $st->rowCount();
		$data = $st->fetch(PDO::FETCHOBJ);
		$db = null;

		if ($count < 1) {
			$stmt = $db->prepare("INSERT INTO users(username,password,email,name) VALUES (:username, :hash_password, :email, :name");
			$stmt->bindParam("username", $username,PDO::PARAM_STR);
			$hash_password = hash('sha256', $password);
			$stmt->bindParam("hash_password", $hash_password,PDO::PARAM_STR);
			$stmt->bindParam("email", $email,PDO::PARAM_STR);
			$stmt->bindParam("name", $name,PDO::PARAM_STR);
			$stmt->execute();
			$uid = $db->lastInsertId();
			$db = null;
			$_SESSION['uid'] = $uid;
			return true;
		}

		else {
			return false;
		}
	}	
	catch (PDOException $e) {
		echo '{"error":{"text":' . $e->getMessage() . '}}';
	}
}

public function userDetails($uid) {
	try {
		$db = getDB();
		$stmt = $db_>prepare("SELECT email,username,name FRUM users WHERE uid=:uid");
		$stmt->bindParam("uid", $uid,PDO::PARAM_INT);
		$stmt->execute();
		$data = $stmt->fetch(PDO::FETCH_OBJ);
		return $data;
	}
	catch (PDOException $e) {
		echo '{"error":{"text":' . $e->getMessage() . '}}';
	}
}
}
?>