
$("#udemy").on("submit", function(event){
    $("#cardSearch .row").empty();
    $("#loading").attr('style', '');
    event.preventDefault();
    const paidSelection = $('#paidSelection').val();
    const searchValue = $('#searchValue').val();
    let params = {
        type: "GET",
        success: function(data){
            console.log(data);
            $("#loading").attr('style', 'visibility: hidden');
            for (i = 0; i < data.results.length; i++){
                $("#cardSearch .row").append(`
                <div class="col-4 mx-auto text-center">
                    <div class="card" style="width: 18rem;">
                        <img src="${data.results[i].image_480x270}" class="card-img-top" alt="...">
                        <div class="card-body">
                            <h5 class="card-title">${data.results[i].title}</h5>
                            <p class="card-text">Price: ${data.results[i].price}</p>
                            <a href="${data.results[i].url}" class="btn btn-primary">Go to link</a>
                        </div>
                    </div>
                </div>
                </>
                `);  
            }
            $(window).scroll(function(){
                if ($(this).scrollTop() + $(window).height() == $(document).height()){
                    $("#loading").attr('style', '');
                    $.ajax({
                        url: data.next,
                        type: "GET",
                        success: function(newData){
                            console.log(newData);
                            $("#loading").attr('style', 'visibility: hidden');
                        },
                        error: function(err){
                            console.log("error!" + err);
                        }
                    })
                }
            });
        },
        error: function(err){
            console.log("error!" + err);
        },
    }
    if (paidSelection == 0){
        params.url = "https://api.techkids.vn/udemy/courses?search=" + searchValue + "&page=1&page_size=12";
    }
    else if (paidSelection == 1){
        params.url = "https://api.techkids.vn/udemy/courses?search=" + searchValue + "&price=price-paid&page=1&page_size=12";
    }
    else if (paidSelection == 2){
        params.url = "https://api.techkids.vn/udemy/courses?search=" + searchValue + "&price=price-free&page=1&page_size=12";
    }
    $.ajax(params);
})
