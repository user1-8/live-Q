<?php

require 'connection.php';

extract($_POST);


$q12= mysqli_query($conn, "SELECT * FROM games WHERE gameid={$gID}");

echo mysqli_fetch_array($q12)['hasStarted'];