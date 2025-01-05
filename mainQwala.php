<?php

require 'inclusives/connection.php';

if(isset($_COOKIE['uname']) && isset($_COOKIE['gID'])){
    // header("Location: mainQwala.php");

}else if(isset($_COOKIE['uname']) && !isset($_COOKIE['gID'])){
    header("Location: index.php");
}else if(!isset($_COOKIE['uname'])){
    header("Location: logreg.php");
}


function randomExclude($min, $max, $exclude = array()) {
    $number = rand($min, $max);
    return in_array($number, $exclude) ? randomExclude($min, $max, $exclude) : $number;
}


$q32 = mysqli_query($conn, "SELECT * FROM games WHERE gameid={$_COOKIE['gID']}");
$game_details = mysqli_fetch_array($q32);

$gStatus = '';
if($game_details['hasStarted']!='yes'){
    $gStatus = 'Not started';
}else{
    if($game_details['hasEnded']!='yes'){
        $gStatus = 'Started';
    }else{
        $gStatus = 'Ended';
    }
}

/*
if(!(isset($_GET['gID']))){
    // echo 'gid not set';

    $gameid_arr = [];
    $q1 = mysqli_query($conn, "SELECT * FROM games");
    while($q2 = mysqli_fetch_array($q1)){
        array_push($gameid_arr, $q2['gameid']);
    }

    $_GET['gID'] = randomExclude(1000, 9999, $gameid_arr);
}

if( !(isset($_GET['subj'])) || !(isset($_GET['chap'])) ){
    $q3 = mysqli_query($conn, "SELECT * FROM games WHERE gameid={$_GET['gID']}");
    $q4 = mysqli_fetch_array($q3);
    $_GET['subj'] = $q4['subject'];
    $_GET['chap'] = $q4['chapter'];
}



// setcookie('uname','anythingHere',time()-3600,'/');
// setcookie('gID','anythingHere',time()-3600,'/');
// setcookie('subj','anythingHere',time()-3600,'/');
// setcookie('chap','anythingHere',time()-3600,'/');

$game_details = array();

if( !isset($_GET['gameActionChose']) ){

    // echo "<script>window.location.href=";</script>";
    header("Location: index.php");

}else if($_GET['gameActionChose'] == 'new'){

    echo "<script>alert('Wow, new game chose');</script>";

}else if($_GET['gameActionChose'] == 'old'){

    echo "<script>alert('Wow, old game chose');</script>";
    
}else{
    // echo "<script>alert('Something is wrong.');</script>";
    header("Location: index.php");

}



// else if{
//     setcookie('uname',$_GET['uname'],time()+(86400*30*12*5),'/');
//     setcookie('gID',$_GET['gID'],time()+(86400*30*12*5),'/');

// }else{
//     $q7 = mysqli_query($conn, "SELECT * FROM games WHERE gameid={$_COOKIE['gID']}");
//     $q8 = mysqli_fetch_array($q7);
//     $_GET['uname'] = $q8['uname'];
//     $_GET['gID'] = $q8['gID'];
//     $_GET['subj'] = $q8['subject'];
//     $_GET['chap'] = $q8['chapter'];


// }





// $q5 = mysqli_query($conn, "SELECT * FROM games WHERE gameid={$_GET['gID']}");

// if(mysqli_num_rows($q5) <1 && isset($_GET['ques_ids'])){
//     $q6 = mysqli_query($conn, "INSERT INTO games (gameid, subject, chapter, ques_ids) VALUES ({$_GET['gID']}, '{$_GET['subj']}', '{$_GET['chap']}', '{$_GET['ques_ids']}')");
//     if($q6){ 
//         // echo "<script>alert('hogya insert');</script>";
//     }else {echo "<script>alert('Something went wrong...');</script>";}
// }

*/




if(isset($_POST['startGbtn'])){
    $q10 = mysqli_query($conn, "UPDATE games SET hasStarted='yes' WHERE gameid={$_COOKIE['gID']} ");
    if($q10){
        echo "<script>
        //alert('hi');
        window.location.href='mainQwala.php';
        </script>";
    }else{
        echo "<script>alert('Something went wrong.');</script>";
    }
}


if(isset($_POST['exitGbtn'])){
    setcookie('gID','anythingHere',time()-3600,'/');
    echo "<script>
        //alert('hi');
        window.location.href='mainQwala.php';
        </script>";
}


$q57 = mysqli_query($conn, "SELECT * FROM users_in_game WHERE gameid={$_COOKIE['gID']} ");
$q66 = mysqli_query($conn, "SELECT * FROM users_in_game WHERE gameid={$_COOKIE['gID']} ");

$q63 = mysqli_query($conn, "SELECT * FROM users_in_game WHERE gameid={$_COOKIE['gID']} AND uname='{$_COOKIE['uname']}'");
$q64 = mysqli_fetch_array($q63);



if(isset($_POST['submit_ans'])){
    // print_r($_POST);

    $q60 = mysqli_query($conn, "UPDATE users_in_game SET completed_game='yes', chosen_options='{$_POST['chosen_optns']}', score={$_POST['score']}, correct={$_POST['correct']}, wrong={$_POST['wrong']}, unattempted={$_POST['unattempted']}, aqt={$_POST['aqt']}, allQtimes='{$_POST['qtimes']}' WHERE gameid={$_COOKIE['gID']} AND uname='{$_COOKIE['uname']}'");

    if($q60){

        $q61 = mysqli_query($conn, "SELECT * FROM users_in_game WHERE gameid={$_COOKIE['gID']}");
        $gEndKarnaHai = true;
        $max_scoreArr=['initial_kuchbhi',-99999999999999];
        $tieBetween_arr = [];

        while($q62 = mysqli_fetch_array($q61)){
            if($q62['completed_game']!='yes'){
                $gEndKarnaHai = false;
                $max_scoreArr=['initial_kuchbhi',-99999999999999];
                $tieBetween_arr = [];
                break;
            }else{
                if( $max_scoreArr[1] != $q62['score'] ){
                    if( max($max_scoreArr[1], $q62['score']) == $q62['score']){
                        $max_scoreArr=[$q62['uname'], $q62['score']];
                        $tieBetween_arr = [];
                    }
                }else{

                    if(count($tieBetween_arr) <1){
                        $tieBetween_arr[0] = [$max_scoreArr[0]];
                        $tieBetween_arr[1]= $max_scoreArr[1];
                    }


                    array_push($tieBetween_arr[0], $q62['uname']);

                }
            }
        }

        if($gEndKarnaHai){
            // echo "<pre>";
            // print_r($tieBetween_arr);
            // echo "\n";
            // print_r($max_scoreArr);
            // echo "</pre>";



            $winner='';
            $tieBetween='';

            if(count($tieBetween_arr) <1){
                $winner=$max_scoreArr[0];
            }else{
                $tieBetween=implode(",",$tieBetween_arr[0]);
            }
            // echo "winner= ".$winner;
            // echo "tieBetween= ".$tieBetween;



            $q67 = mysqli_query($conn, "UPDATE games SET hasEnded='yes', tieBetween='{$tieBetween}', winner='{$winner}' WHERE gameid={$_COOKIE['gID']}");

            if($q67){
                echo "<script>
                alert('GAME ENDED.');
                //window.location.href='mainQwala.php';
                </script>";
            }else{
                echo "<script>alert('Something went wrong.');</script>";
            }
        }


        echo "<script>
        //alert('hi');
        window.location.href='mainQwala.php';
        </script>";
    }else{
        echo "<script>alert('Something went wrong.');</script>";
    }
}




if(isset($_POST['endGbtn'])){

    $q68 = mysqli_query($conn, "SELECT * FROM users_in_game WHERE gameid={$_COOKIE['gID']} AND completed_game='yes'");

    $max_scoreArr_1=['initial_kuchbhi',-99999999999999];
    $tieBetween_arr_1 = [];
    
    if(mysqli_num_rows($q68)>0){
        while($q69 = mysqli_fetch_array($q68)){
            if( $max_scoreArr_1[1] != $q69['score'] ){
                if( max($max_scoreArr_1[1], $q69['score']) == $q69['score']){
                    $max_scoreArr_1=[$q69['uname'], $q69['score']];
                    $tieBetween_arr_1 = [];
                }
            }else{

                if(count($tieBetween_arr_1) <1){
                    $tieBetween_arr_1[0] = [$max_scoreArr_1[0]];
                    $tieBetween_arr_1[1]= $max_scoreArr_1[1];
                }


                array_push($tieBetween_arr_1[0], $q69['uname']);

            }
        }
    }

    // echo "<pre>";
    // print_r($tieBetween_arr_1);
    // echo "\n";
    // print_r($max_scoreArr_1);
    // echo "</pre>";



    $winner='';
    $tieBetween='';

    if(mysqli_num_rows($q68)>0){
        if(count($tieBetween_arr_1) <1){
            $winner=$max_scoreArr_1[0];
        }else{
            $tieBetween=implode(",",$tieBetween_arr_1[0]);
        }
    }

    // echo "winner= ".$winner;
    // echo "tieBetween= ".$tieBetween;


    $q67 = mysqli_query($conn, "UPDATE games SET hasEnded='yes', tieBetween='{$tieBetween}', winner='{$winner}' WHERE gameid={$_COOKIE['gID']}");

    if($q67){
        echo "<script>
        alert('GAME ENDED.');
        window.location.href='mainQwala.php';
        </script>";
    }else{
        echo "<script>alert('Something went wrong.');</script>";
    }


}

    

?>

<!DOCTYPE html>
<html>
<head>
    

    <?php include 'inclusives/inside_head.html';?>

    <title>Live-Q</title>
    
    <link rel="stylesheet" href="mainQwala.css">

    

</head>
<body>
    
    <div class="preloader_outer">
        <img src="inclusives/load-35_256.gif" alt="preloader gif" class="preloader_gif">
        <div class="preloader">
            LiveQ
        </div>
    </div>


    <div class="main max_width_fixed_forLargeScreen">

        <div class="game_info pt-1">

            <div class="topGoptions d-flex justify-content-end mb-2">

                <?php 
                if($game_details['createdby']==$_COOKIE['uname'] && trim($q64['completed_game'])=='yes' && $game_details['hasEnded']!='yes'){
                ?>
                <form class="ms-2 endgame text-right" method="POST">
                    <button type="submit" name="endGbtn" class="btn btn-primary">End game for all</button>
                </form>
                <?php
                }
                ?>


                <form class="ms-2 exitgame text-right" method="POST">
                    <button type="submit" name="exitGbtn" class="btn btn-primary">Exit game</button>
                </form>
            </div>

            <div class="gCreatedby d-none"><?php echo $game_details['createdby'];?></div>
            <div class="gid d-inline-block me-2">Game ID: <span><?php echo $_COOKIE['gID']; ?></span>; </div>
            <div class="gStatus d-inline-block me-2">Game Status: <span><?php echo $gStatus; ?></span>; </div>
            <br>
            <div class="numOfQ d-inline-block me-2">No. of Questions: <span><?php echo $game_details['numOfQ']; ?></span>; </div>
            <div class="subj d-inline-block me-2">Subject: <span><?php echo $game_details['subject']; ?></span>; </div>
            <div class="chap d-inline-block me-2">Chapter: <span><?php echo $game_details['chapter']; ?></span>; </div>
            <div class="ques_ids d-none me-2"><?php echo $game_details['ques_ids']; ?></div>
            <div class="players">
                Players :- <img src="inclusives/grey-9026_256.gif" alt="loading players animation" class="d-inline-block loading_players_anim" style="width:2rem;">
                <br>
                <ul class="list-group">

                  <?php 
                    if($game_details['createdby'] != $_COOKIE['uname']){
                  ?>

                  <li class="list-group-item d-flex justify-content-between align-items-center">
                    <?php echo $_COOKIE['uname']; ?> 
                    <span class="badge bg-dark rounded-pill ms-2">You</span>
                  </li>

                  <li class="list-group-item d-flex justify-content-between align-items-center">
                    <?php echo $game_details['createdby']; ?> 
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

                    while($q58 = mysqli_fetch_array($q57)){

                        if($q58['uname']!=$game_details['createdby'] && $q58['uname']!=$_COOKIE['uname']){
                            ?>

                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                <?php echo $q58['uname'];?>
                            </li>

                            <?php
                        }

                    }

                  ?>
                </ul>
            </div>
        </div>


        <?php
            $d_none_class = '';

            if($game_details['hasStarted']!='yes'){
                $d_none_class = 'd-none';
                if($game_details['createdby']==$_COOKIE['uname']){
        ?>

        <form method="POST">
            <div class="gameStartKarein text-center">
                <button type="submit" name="startGbtn" class="btn btn-primary btn-lg">Start game</button>
            </div>
        </form>

        <?php
                }else{
                    echo '<h4 class="wait_GnotStarted mb-5">Wait for the Creator to start this game. <br> 
                    Have patience, Game may start any moment...</h4>';
                }
            }

            if( trim($q64['completed_game'])=='yes' || (trim($q64['completed_game'])!='yes' && $game_details['hasEnded']=='yes') ){
        ?>

        <div class="result_overview">
            <?php
            if($game_details['hasEnded']=='yes'){
                if(trim($game_details['winner'])!="" && mysqli_num_rows($q66)>1){
            ?>
            <h3 class="winner text-center fw-bold">Winner: <span><?php echo $game_details['winner'];?></span></h3>
            <?php
                }else if(trim($game_details['tieBetween'])!=""){
            ?>
            <h3 class="butTie text-center fw-bold">It's a tie! <br>
                <span>between <?php echo str_replace(',', ' & ', $game_details['tieBetween']);?></span>
            </h3>
            <?php 
                }
            }else{
                $waitForAnalysis = '<h5 class="waitForAnalysis mb-5">For Questions\' analysis, <br>Wait till all players finish the game OR Creator ends this game himself. <br>Refresh after some time.</h5>';
                $d_none_class = 'd-none';

            }
            ?>

            <div class="table-responsive">
                <table class="table table-bordered text-center">
                    <thead> <tr>
                        <th>Player</th>
                        <th>Score</th>
                        <th>C</th>
                        <th>W</th>
                        <th>U</th>
                        <th>AQT</th>
                    </tr> </thead>

                    <tbody class=""> 

                        <tr>
                            <td>
                                <?php 
                                    echo '<b>'.$q64['uname'].'</b>';
                                    echo ($q64['completed_game']=='yes') ? '':'<div class="text-secondary" style="font-size:.8rem;">(Didn\'t Finish)';
                                ?>
                            </td>
                            <td><?php echo ($q64['completed_game']=='yes') ? $q64['score']:'-' ;?></td>
                            <td><?php echo ($q64['completed_game']=='yes') ? $q64['correct']:'-' ;?></td>
                            <td><?php echo ($q64['completed_game']=='yes') ? $q64['wrong']:'-' ;?></td>
                            <td><?php echo ($q64['completed_game']=='yes') ? $q64['unattempted']:'-' ;?></td>
                            <td><?php echo ($q64['completed_game']=='yes') ? $q64['aqt'].'s':'-' ;?></td>
                        </tr>

                        <?php

                        $users_qtimings_arr = [];
                        $users_chosenOptns_arr = [];

                        if($q64['completed_game']=='yes'){
                            array_push($users_qtimings_arr, [$q64['uname'], $q64['allQtimes']] );
                            array_push($users_chosenOptns_arr, [$q64['uname'], $q64['chosen_options']] );
                        }

                        while($q65 = mysqli_fetch_array($q66)){
                            if($q65['uname']!=$q64['uname']){
                                if($q65['completed_game']=='yes'){
                                    array_push($users_qtimings_arr, [$q65['uname'], $q65['allQtimes']] );
                                    array_push($users_chosenOptns_arr, [$q65['uname'], $q65['chosen_options']] );
                        ?>

                        <tr>
                            <td><?php echo $q65['uname'];?></td>
                            <td><?php echo $q65['score'];?></td>
                            <td><?php echo $q65['correct'];?></td>
                            <td><?php echo $q65['wrong'];?></td>
                            <td><?php echo $q65['unattempted'];?></td>
                            <td><?php echo $q65['aqt'];?>s</td>
                        </tr>

                        <?php 
                                }else{
                        ?>

                        <tr>
                            <td><?php echo $q65['uname'];?> 
                                <div class="text-secondary" style="font-size:.8rem;">(Didn't Finish)</div>
                            </td>
                            <td>-</td> <td>-</td> <td>-</td> <td>-</td> <td>-</td>
                        </tr>

                        <?php
                                }
                            }
                        }
                        ?>
                        
                    </tbody>

                </table>
            </div>

            <i class="shortForms text-secondary">

                <?php
                if($game_details['hasEnded']!='yes'){
                    echo 'Not all players have finished this game yet. Refresh to see their result when they finish.<br>';
                }
                ?>
                

                C = Correct <br>
                W = Wrong <br>
                U = Unattempted <br>
                AQT = Avg. Question Time <br>
            </i>

        </div>

        <?php
            }

            if(isset($waitForAnalysis)){
                echo $waitForAnalysis;
            }
        ?>



        <div class="qSection <?php echo $d_none_class;?> ">
            <div class="chosen_optns_show ">
                <?php
                if(isset($users_chosenOptns_arr)){
                    if(count($users_chosenOptns_arr)>0){
                        foreach ($users_chosenOptns_arr as $x) {
                            echo "<div class=\"chosen_inner\"><i>{$x[0]}</i> : <b class=\"fw-normal\">{$x[1]}</b></div>";
                        }
                    }
                }
                ?>
            </div>
            <div class="timers text-center">
                <div class="gTimer">Game Stopwatch: <b></b></div>
                <div class="qTimer">Question Stopwatch: <b></b></div>
                <?php

                if(isset($users_qtimings_arr)){
                    // print_r($users_qtimings_arr);
                    if(count($users_qtimings_arr)>0){
                        foreach ($users_qtimings_arr as $x) {
                            echo "<div class=\"playerTime\"><span>{$x[0]}</span>: <b>{$x[1]}</b></div>";
                        }
                    }
                }
                ?>

            </div>

            <div class="navigateQ">
                <button class="btn btn-primary prev">Previous</button>
                <form class="nextbtn_form m-0" method="POST">
                    <button type="submit" name="submit_ans" class="btn btn-primary next">Next</button>
                </form>
            </div>

            <div class="qcompContainer_parent">
                <div class="qcompContainer">
                    
                </div>
            </div>

            <div class="navigateQ">
                <button class="btn btn-primary prev">Previous</button>
                <form class="nextbtn_form m-0" method="POST">
                    <button type="submit" name="submit_ans" class="btn btn-primary next">Next</button>
                </form>
            </div>
        </div>

    </div>
    



    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>

    <script src="inclusives/qbank.js"></script>
    <script src="forall.js"></script>

    <script src="mainQwala.js"></script>
    
</body>
</html>