<?php

require 'inclusives/connection.php';


function randomExclude($min, $max, $exclude = array()) {
    $number = rand($min, $max);
    return in_array($number, $exclude) ? randomExclude($min, $max, $exclude) : $number;
}


if(isset($_COOKIE['uname']) && isset($_COOKIE['gID'])){
    header("Location: mainQwala.php");

}else if(isset($_COOKIE['uname']) && !isset($_COOKIE['gID'])){
    // header("Location: index.php");
}else if(!isset($_COOKIE['uname'])){
    header("Location: logreg.php");
}



if(isset($_POST['createGameBtn'])){
    // $q70 = mysqli_query($conn, "SELECT * FROM games WHERE gameid={$_GET['gID']}");

    // print_r($_POST);
    if(isset($_GET['ques_ids'])){
        // echo "ques_ids= ".$_GET['ques_ids'];
    }


    $gameid_arr = [];
    $q1 = mysqli_query($conn, "SELECT * FROM games");
    while($q2 = mysqli_fetch_array($q1)){
        array_push($gameid_arr, $q2['gameid']);
        // echo $q2['gameid'];
    }

    $new_gID = randomExclude(1000, 9999, $gameid_arr);
    // ----$gameid_arr contains nums in string format but php allows comparison of: "92"==92 gives true



    // $q52 = mysqli_query($conn, "SELECT * FROM games WHERE gameid={$new_gID}");

    $q6 = mysqli_query($conn, "INSERT INTO games (gameid, createdby, subject, chapter, numOfQ, ques_ids) VALUES ({$new_gID}, '{$_COOKIE['uname']}', '{$_POST['subj']}', '{$_POST['chap']}', {$_POST['numOfQ']}, '{$_GET['ques_ids']}')");

    if($q6){ 
        // echo "<script>alert('hogya insert into games');</script>";


        $q8 = mysqli_query($conn, "INSERT INTO users_in_game (uname, gameid) VALUES ('{$_COOKIE['uname']}', {$new_gID})");

        if($q8){ 
            // echo "<script>alert('hogya insert into users_in_game');</script>";

            setcookie('gID', $new_gID, time()+(86400*30*12*5),'/');
            
            header("Location: mainQwala.php");

        }else {echo "<script>alert('Something went wrong...');</script>";}

    }else {echo "<script>alert('Something went wrong...');</script>";}
}


if(isset($_POST['joinGameBtn'])){

    // print_r($_POST);

    $q53 = mysqli_query($conn, "SELECT * FROM games WHERE gameid={$_POST['gID']}");

    if(mysqli_num_rows($q53)<1){
        echo "<script>alert('No such Game exists...');</script>";
    }else{

        $q54 = mysqli_query($conn, "SELECT * FROM users_in_game WHERE uname='{$_COOKIE['uname']}' AND gameid={$_POST['gID']}");

        if(mysqli_num_rows($q54) > 0){
            // echo "<script>alert('Entered username has already been used by someone to play that game. Please choose a different username...');</script>";

            setcookie('gID', $_POST['gID'], time()+(86400*30*12*5),'/');
            header("Location: mainQwala.php");
        }else{

            $q9 = mysqli_query($conn, "INSERT INTO users_in_game (uname, gameid) VALUES ('{$_COOKIE['uname']}', {$_POST['gID']} )");

            if($q9){ 
                echo "<script>//alert('hogya insert into users_in_game');</script>";

                setcookie('gID', $_POST['gID'], time()+(86400*30*12*5),'/');
                
                header("Location: mainQwala.php");

            }else {echo "<script>alert('Something went wrong...');</script>";}
        }
    }

}




if(isset($_POST['logoutBtn'])){
    setcookie('uname','anythingHere',time()-3600,'/');
    echo "<script>
        alert('Logout successful.');
        window.location.href='index.php';
        </script>";
}


$q55 = mysqli_query($conn, "SELECT * FROM users_in_game WHERE uname='{$_COOKIE['uname']}' ORDER BY id DESC");

if(isset($_POST['openPrevG'])){
    setcookie('gID', $_POST['gID'], time()+(86400*30*12*5),'/');
    header("Location: mainQwala.php");
}




?>

<!DOCTYPE html>
<html>
<head>

    <?php include 'inclusives/inside_head.html';?>

    <title>Live-Q</title>
    <link rel="stylesheet" href="style.css">

</head>
<body>
    
    <div class="accountinfo p-3 max_width_fixed_forLargeScreen">
        <form method="POST" class="logout_container text-right">
            <button type="submit" name="logoutBtn" class="btn btn-danger">Logout</button>
        </form>
        <div class="uname_container">
            Logged in as: <b><?php echo $_COOKIE['uname'];?></b>
        </div>

    </div>

    <div class="main max_width_fixed_forLargeScreen">
        <select class="chooseAction form-select">
            <option value="">Choose Action</option>
            <option value="new">Create new game</option>
            <option value="old">Enter existing game</option>
        </select>

        <form method="post" class="form_newold new_game">
            <input type="text" name="gameActionChose" class="d-none" value="new">

            <select class="subj_select form-select mb-3" name="subj" required>
                <option value="">Choose Subject</option>
                <option value="physics">Physics</option>
                <option value="chemistry">Chemistry</option>
                <option value="biology">Biology</option>
                <!-- <option value="math">Maths</option> -->
            </select>
            <select class="chap_select form-select mb-3" name="chap" required>
                <option value="">Choose Chapter</option>
            </select>
            <!-- <select class="exam_select form-select mb-3" name="exam" required>
                <option value="">Choose Exam</option>
                <option value="jee">JEE</option>
                <option value="neet">NEET</option>
            </select> -->
            <div class="input-group mb-3">
              <span class="input-group-text">No. of Questions</span>
              <input type="number" class="form-control" name="numOfQ" required>
            </div>
            <button type="submit" class="btn btn-primary" name="createGameBtn">Create Game</button>
        </form>

        <form method="post" class="form_newold old_game">
            <input type="text" name="gameActionChose" class="d-none" value="old">

            <div class="input-group mb-3">
              <span class="input-group-text">Game Id</span>
              <input type="number" class="form-control" name="gID" required>
            </div>
            <button type="submit" class="btn btn-primary" name="joinGameBtn">Enter Game</button>
        </form>
    </div>

    <?php
    if(mysqli_num_rows($q55)>0){
    ?>

    <div class="joinedGcontainer p-3 mt-2 max_width_fixed_forLargeScreen">
        Previously joined games:- 
        <div class="table-responsive mt-1">
            <table class="table table-bordered text-center">
                <thead> <tr class="bg-secondary">
                    <th class="bg-dark align-middle text-light">Game Id</th>
                    <th class="bg-dark align-middle text-light">Chapter</th>
                    <th class="bg-dark align-middle text-light">Score</th>
                    <th class="bg-dark align-middle text-light">Action</th>
                </tr> </thead>

                <tbody> 
                    <?php
                    while($q56 = mysqli_fetch_array($q55) ){
                        $q5f5 = mysqli_query($conn, " SELECT * FROM games WHERE gameid={$q56['gameid']} ");
                        $q5g5 = mysqli_fetch_array($q5f5);

                    ?>

                    <tr>
                        <td class="align-middle"><?php echo $q56['gameid'];?></td>
                        <td class="align-middle"><?php echo $q5g5['chapter'];?></td>
                        <td class="align-middle"><?php echo $q56['score'];?></td>
                        <td class="align-middle">
                            <form method="POST">
                                <input type="text" readonly class="d-none border border-dark" name="gID" value="<?php echo $q56['gameid'];?>">
                                <button type="submit" name="openPrevG" class="btn btn-primary">Open</button>
                            </form>
                        </td>
                    </tr>

                    <?php
                    }
                    ?>
                    
                </tbody>

            </table>
        </div>

    </div>

    <?php
    }
    ?>
    




    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>

    <script src="inclusives/qbank.js"></script>
    <script src="forall.js"></script>
    <script src="script.js"></script>
    
</body>
</html>