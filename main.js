var networkKey= "key=5eed18d0e03d592433311884813bce77";
var searchUrl
var styleId
var abvPerc
var nameList = []


$("#search").on("click", function(e){
  e.stopPropagation();
  if ($('.storageUl').length > 0) return;
  var list = localStorage.getItem('nameList');

  if(!list) return;
  list = JSON.parse(list);

  var storageList= $("<p><class='.storageUl'></p>");

  for (var i = 0; i < list.length; i++) {
    var li = $('<p>' + "Last Searched: " + list[i] + '</p>');
    storageList.append(li)
  }
  $(".storage").append(storageList);
});

$('input').on("click", function(){
  for (var i = 0; i < $(".style").length; i++) {
    if($(".style")[i].checked === true) {
      var name = $(".style")[i].value;
    }
  }
    console.log(name);
var list = localStorage.getItem('nameList');
if(!list) {
  list = [];
  list.push(name);
}
else{
  var listArray = JSON.parse(list);
  if(listArray.indexOf(name) === -1) {
    listArray[0]= name;

  }
  list = listArray;
}
localStorage.setItem('nameList', JSON.stringify(list));
console.log(localStorage.getItem("nameList"));

var list = localStorage.getItem('nameList');
if(!list) return;
list = JSON.parse(list);
$('.storageUl').remove();
});




function clear() {
  $("#cards").empty();
  // $('.storage').empty();
}



$("#clear").on("click", clear);

$("#warning").hide();

function beerSearch () {
  var checkCount = 0;
  var abvCount = 0;
  $("#search").on("click", function(){
    clear();
    for (var i = 0; i < $(".style").length; i++) {
      if($(".style")[i].checked === true) {
        styleId= $(".style")[i].id;
      }
      else if ($(".style")[i].checked === false){
        checkCount++
      }
    }
    for (var j = 0; j < $(".abv").length; j++) {
      if($(".abv")[j].checked === true) {
      abvPerc= $(".abv")[j].id;
      }
      else if ($(".abv")[j].checked === false){
        abvCount++
      }
    }
    if (checkCount === 12 && abvCount === 5) {
      checkCount = 0;
      abvCount = 0;
      $("#warning").show();
      throw new Error();
    }
    else {
      $("#warning").hide();
    }
    searchUrl = "http://g-brewerydb.herokuapp.com?" + styleId + '&' + abvPerc + '&' + networkKey;

    console.log(searchUrl);
    $.ajax({
      url:searchUrl,
      method: "GET",
      dataType: 'json',
      success: function(response) {
        console.log(response);
        for (var i = 0; i < response.data.length; i++) {
          createBeerCard(response.data[i]);
        }
      }
    });
  })
}

function createBeerCard(beer) {
  html = `
  <div class="demo-card-square mdl-card mdl-shadow--2dp">
    <div class="mdl-card__title mdl-card--expand">
      <h2 id="beerName" class="mdl-card__title-text">Beer Name</h2>
    </div>
    <div class="mdl-card__supporting-text">
      <p><a id="beerLink" href="" target="_blank">Beer Website</a></p>
      <p id="beerStyle">Beer Style</p>
      <p id="abv">ABV%</p>
    </div>
    <div class="mdl-card__actions mdl-card--border">
      <a id="beerInfo" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
        Beer Info
      </a>
      <div>
        <p id="beerDesc">Description Not Available</p>
      </div>
    </div>
  </div>
  `;
  $element = $(html);

  $($element).find('#beerLink').attr("href", "http://www.brewerydb.com/beer/" + beer.id);
  $($element).find('#beerName').text(beer.name);
  $($element).find('#abv').text("AVB: " + beer.abv +"%");
  $($element).find('#beerStyle').text("Style: " + beer.style.name);
  $($element).find('#beerDesc').text(beer.description);
  $($element).find('#beerDesc').hide();

  $($element).find('#beerInfo').click(function() {
    $(this).parent().find('#beerDesc').toggle();
  })

  $('#cards').append($element);
}


$(function() {
  beerSearch();

});
$('#showStyles').hide();
$('#stylesClick').on('click', function(){
  $('#showStyles').toggle();
})
$('.abv').hide();
$('#abvClick').on('click', function(){
  $('.abv').toggle();
})
$('#styles-panel').show();
$('#hide').on('click', function(){
  $('#styles-panel').toggle();
})
