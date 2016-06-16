
$(window).load(function(){
	document.addEventListener('tizenhwkey', function(e) {
        if(e.keyName == "back")
	try {
	    tizen.application.getCurrentApplication().exit();
	} catch (ignore) {
	}
    });
	
	
	$( document ).ready(function() {
		rotaryEventHandler = function(e){
	            if (e.detail.direction === "CW")
	            /* Right direction */
	            {
	               showIncrement();
	            }
	            else if (e.detail.direction === "CCW")
	            /* Left direction */
	            {
		               showDecrement();
	            }
	         };

	    /* Register the rotary event */
	    document.addEventListener("rotarydetent", rotaryEventHandler, false);
		
				
		getPage(function(){
			showImage();
		});
	});
	$('#image').click(function(){
		showIncrement();
	});
});

var image_index = 0;
var current_page_index = 0;
var current_length = -1;
var current_page;

function setHeader(xhr) {
	xhr.setRequestHeader('Authorization', AUTH_KEY);
}
function display(link){	
	var $image = $("img").first();
	var $downloadingImage = $("<img>");
	$image.attr("src", "loading.gif");
	$downloadingImage.load(function(){
	  $image.attr("src", $(this).attr("src"));	
	});
	$image.attr("src",link);
}
function showIncrement(){
	image_index++;
	if (image_index > current_length){
		image_index = 0;
		current_page_index++;
		getPage(function(){
			showImage();
		});
	} else{
		showImage();			
	}
}
function showDecrement(){
	if (image_index > 0 || current_page_index > 0){
		image_index--;
		if (image_index < 0){
			image_index = 0;
			current_page_index--;
			getPage(function(){
				image_index = current_length -1;
				showImage();
			});
		} else{
			showImage();			
		}
	}
}
function showImage(){
	//retrieve the current entry
	if (current_page){
		var current_entry = current_page[image_index];
		if (current_entry.is_album){
			$.ajax({
				url: 'http://api.imgur.com/3/gallery/album/'+current_entry.id,
				type: 'GET',
				dataType: 'json',
				success: function(albumdata) { 
					var obj = albumdata.data.images[0];
					display(obj.link);
				},
				error: function() {
					//we'll try to skip this for now, decrement?
					showIncrement();
				},
				beforeSend: setHeader
			});
		} else {
			display(current_entry.link);
		}
	}
}
function getPage(cb){
	$.ajax({
		url: 'https://api.imgur.com/3/gallery/hot/viral/'+current_page_index+'.json',
		type: 'GET',
		dataType: 'json',
		success: function(data) { 
			current_length = data.data.length;
			current_page = data.data;
			cb();
		},
		error: function() { alert('boo!'); },
		beforeSend: setHeader
	});
}

