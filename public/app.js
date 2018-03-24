$(document).on('click', '.timesBtn', function(event){
    event.preventDefault();

    var id = $(this).attr('id');
    var par = $(this).parent();
    var parTitle = $(this).parent().attr('data-title');
    var parLink = $(this).parent().attr('data-link');

    var newSaved = {
        title: parTitle,
        link: parLink
    }

    console.log("Heres the newSaved data object that we send through the AJAX call");
    console.log(newSaved);

    $.ajax("/", {
        type: "POST",
        data: newSaved
    }).done((res, err) => {
        console.log(err);
    });
    
    $.ajax('/saved', {
        type: "GET"
    }) .done((res, err) => {
        window.location = '/saved';
    })
})