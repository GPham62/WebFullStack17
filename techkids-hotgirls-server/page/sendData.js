$("#Login").on("submit", function(event){
    event.preventDefault();
    const username = $("#username").val();
    const password = $("#password").val();
    $.ajax({
        url: "/api/auth/login",
        type: "POST",
        data: {username, password},
        success: function(data){
            console.log(data);
            if (data.data == false){
                $("#alertPassword").attr("class", "text-danger");
                $("#alertPassword").text("Wrong Username or Password!");
            }
            else if (data.data == true){
                $("#alertPassword").attr("class", "text-success");
                $("#alertPassword").text("Login success!");
            }
        },
        error: function(err){
            console.log(err);
        }
    })
})