var nextPageUrl = null;
var loadingMore = false;
$(document).ready(function(){
    $("#searchCourse").on("submit", function(event){
        event.preventDefault();
        const keyword = $("#keyword").val();
        $("#results").html('');
        loadData(`https://udemy-course-api.herokuapp.com/api/courses?search=${keyword}&page=1&page_size=12`);
    });

    $(window).on("scroll", function(){
        if (!loadingMore && nextPageUrl && $(document).height() - ($(window).height() + $(window).scrollTop()) < 400){
            loadingMore = true;
            loadData(nextPageUrl);
        }
    })
});

function loadData(url){
    $.ajax({
        url: url,
        type: "GET",
        success: function(data){
            console.log(data);
            const {results, next} = data;
            nextPageUrl = next;
            const resultsElem = results.map(function(item){
                return `<div class="card" style="width: 20rem;">
                <img src="${item.image_480x270}" class="card-img-top" alt="...">
                <div class="card-body">
                  <h5 class="card-title">${item.title}</h5>
                  <p class="card-text"></p>
                  <a target="_blank" href="https://udemy.com${item.url}" class="btn btn-primary">View Course</a>
                </div>
              </div>`;
            })
            $("#results").append(resultsElem);
            loadingMore = false;
        },
        error: function(err){
        console.log(err);
        }
    })
}

