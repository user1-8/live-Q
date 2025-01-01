<?php

require 'inclusives/connection.php';

if(isset($_COOKIE['uname']) && isset($_COOKIE['gID'])){
    header("Location: mainQwala.php");

}else if(isset($_COOKIE['uname']) && !isset($_COOKIE['gID'])){
    header("Location: index.php");
}else if(!isset($_COOKIE['uname'])){
    // header("Location: logreg.php");
}



if(isset($_POST['loginbtn'])){

  $logname = trim($_POST['logname']);
  $logpass = $_POST['logpass'];

  $q2 = mysqli_query($conn, "SELECT * FROM accounts WHERE uname='{$logname}'");

  if($q2){
    if(mysqli_num_rows($q2) < 1){
      echo '<script>
      alert("Account not Found... Please create an account and then login.");
      window.location.href="logreg.php";
      </script>';
    }else{
      $userAcc_arr = mysqli_fetch_array($q2);
      $logname = $userAcc_arr['uname']; // so that stored uname is same as in table in terms of capital letters and stuff also


      if($userAcc_arr['password'] == $logpass){
        setcookie('uname',$logname,time()+(86400*30*12*5),'/');

        echo '<script>
        alert("Login Successfull!");
        window.location.href="index.php";
        </script>';
      }else{
        echo '<script>
        alert("Sorry, your password was incorrect...");
        window.location.href="logreg.php";
        </script>';
      }
    }
  }else{
    echo '<script>
    alert("not happen");
    </script>';
  }
}




if(isset($_POST['signupbtn'])){
  $regname = trim($_POST['regname']);
  $regpass1 = $_POST['regpass1'];
  $regpass2 = $_POST['regpass2'];



  function my_mysqliShowingQuery($connection, $query, $whichRowWanted){
    $tobereturnedarr = array();
    $q32 = mysqli_query($connection, $query);

    while($myarr = mysqli_fetch_array($q32)){
      array_push($tobereturnedarr, $myarr[$whichRowWanted]);
    }

    return $tobereturnedarr;
    echo '<script>
    alert("'.$regname.':'.$regpass1.':'.$regpass2.'");
    </script>';
  }



  
  function insertNow($conn, $regname, $regpass1){
    $q1 = mysqli_query($conn, "INSERT INTO accounts(uname,password) VALUES('{$regname}','{$regpass1}')");
    
    if($q1){
      echo '<script>
      alert("Account created successfully! You can now login to start using the service.");
      window.location.href="index.php";
      </script>';
    }else{
        echo '<script>
          alert("There was a problem creating your account.");
            
        </script>';
    }
  }

  $qr = "SELECT * FROM accounts";
  $all_unames_arr = my_mysqliShowingQuery($conn, $qr, 'uname');
  $uname_already_exist = false;

  if(mysqli_num_rows(mysqli_query($conn,$qr))>0){
    foreach($all_unames_arr as $curr_uname){
      if (strtolower($curr_uname) == strtolower($regname)){
        $uname_already_exist = true;
      }
    }
  }

  if($uname_already_exist == false){
    insertNow($conn, $regname, $regpass1);
  }else{
    echo '<script>
    alert("Username already taken. Please use a different username...");
    window.location.href="logreg.php";
    </script>';
  }


  
}


    

?>

<!DOCTYPE html>
<html>
<head>

    <?php include 'inclusives/inside_head.html';?>

    <title>Live-Q</title>
    <link rel="stylesheet" href="logreg.css">


</head>
<body>
    
    <div class="main">
        <!-- 
        <form method="post" class="logform " style="border:2px solid;">
            <h2>LOGIN</h2>
            <input type="text" name="gameActionChose" class="d-none" value="old">

            <div class="input-group mb-3">
              <span class="input-group-text">Username</span>
              <input type="text" class="form-control" name="uname" required>
            </div>
            <div class="input-group mb-3">
              <span class="input-group-text">Game Id</span>
              <input type="number" class="form-control" name="gID" required>
            </div>
            <button type="submit" class="btn btn-primary" name="joinGameBtn">Enter Game</button>
        </form> -->




        <div class="mysection log_reg">

          <div class="login" id="logindiv">
          
            <h1 class="title"> Login </h1>
            
            <form id="logform" method="POST" autocomplete="off">
              <div class="inputWrapper">
                <div class="inputing">
                  <input type="text" placeholder="Username" name="logname" class="logname">
                  <i class="fas fa-info">
                    <div class="mytooltip">Enter the username of your account you chose.</div>
                  </i>
                </div>
                <div class="err" id="lognameerr">
                  
                </div>
              </div>
      
              <div class="inputWrapper">
                <div class="inputing">
                  <input type="password" placeholder="Password" name="logpass" class="logpass">
                  <i class="fas fa-info">
                    <div class="mytooltip">Enter the password of your account here.</div>
                  </i>
                </div>
                <div class="err" id="logpasserr">
                  
                </div>
              </div>
              
      
              <button type="submit" class="btn btn-primary loginbtn style_btn" name="loginbtn">Login</button>
            </form>
      
          </div>


          <div class="signup" id="signupdiv">
          
            <h1 class="title"> Signup </h1>
            
            <form id="regform" method="POST" autocomplete="off">
              <div class="inputWrapper">
                <div class="inputing">
                  <input type="text" placeholder="Username" name="regname"  class="regname">
                  <i class="fas fa-info">
                    <div class="mytooltip">Choose a username for your account e.g. gaurav32, shaurya_880, etc. If the username is not availible, you can add something before or after the username.</div>
                  </i>
                </div>
                <div class="err" id="regnameerr">
                  
                </div>
              </div>
              <div class="inputWrapper">
                <div class="inputing">
                  <input type="password" placeholder="Password" name="regpass1"  class="regpass1">
                  <i class="fas fa-info">
                    <div class="mytooltip">Choose a password for your account so that nobody else can use your account. Long passwords are preferred.</div>
                  </i>
                </div>
                <div class="err" id="regpass1err">
                  
                </div>
              </div>
              <div class="inputWrapper">
                <div class="inputing">
                  <input type="password" placeholder="Re-enter Password" name="regpass2" class="regpass2">
                  <i class="fas fa-info">
                    <div class="mytooltip">Enter the above password once again for verification.</div>
                  </i>
                </div>
                <div class="err" id="regpass2err">
                  
                </div>
              </div>
      
              <button type="submit" class="btn btn-primary signupbtn style_btn" name="signupbtn">Signup</button>
            </form>
      
          </div>

        </div>

    </div>
    




    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>

    <script src="inclusives/qbank.js"></script>
    <script src="forall.js"></script>
    <script src="logreg.js"></script>
    
</body>
</html>