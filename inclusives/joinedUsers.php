<?php

require 'connection.php';
extract($_POST);



if($createdby != $_COOKIE['uname']){
	?>

	<li class="list-group-item d-flex justify-content-between align-items-center">
	<?php echo $_COOKIE['uname']; ?> 
	<span class="badge bg-dark rounded-pill ms-2">You</span>
	</li>

	<li class="list-group-item d-flex justify-content-between align-items-center">
	<?php echo $createdby; ?> 
	<span class="badge bg-secondary rounded-pill ms-2">Creator</span>
	</li>

	<?php 

}else{

	?>

	<li class="list-group-item d-flex justify-content-between align-items-center">
	    <?php echo $_COOKIE['uname']; ?> 
	    <span class="badge bg-dark rounded-pill ms-2">You, Creator</span>
	</li>

	<?php
}




$q58 = mysqli_query($conn, "SELECT * FROM users_in_game WHERE gameid={$_COOKIE['gID']} ");

while($q59 = mysqli_fetch_array($q58)){

	if($q59['uname']!=$createdby && $q59['uname']!=$_COOKIE['uname']){
		?>

		<li class="list-group-item d-flex justify-content-between align-items-center">
	    	<?php echo $q59['uname'];?>
	    </li>

		<?php
	}

}