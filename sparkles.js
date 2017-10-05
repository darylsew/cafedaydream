$(document).ready(function() {
	/* Load a specific page */
	if (window.location.hash) {
		var dataDivs = document.querySelectorAll('*[id]:not([id="navi"]');
 		var targetId = window.location.hash.substring(1);
 		for (var item of dataDivs) {
 			if (targetId === item.id) {
 				$("#navi").animate({ "top": "5%" }, "slow");
				$("#" + targetId).slideToggle("slow");
 			}
 		}
	}

	$(function() {
		$(".tile").click(function() {
			const targetId = $(this).attr("data-target");		// a self-defined attribute 

			$(this).parent().children().each(function(e) {
				const currId = $(this).attr("data-target");
				// console.log(currId);

				if (currId != targetId) {
					$("#" + currId).slideUp();
				}
			});
			$("#navi").animate({ "top": "5%" }, "slow");
			if ($("#" + targetId).is(":visible")) {
				$("#navi").animate({ "top": "20%" }, "slow");
			}
			$("#" + targetId).slideToggle("slow");
			// window.location.hash = targetId;
		});
	});

	$(function() {
		$(".tile").hover(function() {
			const target = $(this);
			$(this).parent().children().each(function(e) {
				if (!target.is($(this))) {
					$(this).animate({"opacity": "0.4"}, 00);
				}
			});
		}, function() {
			$(this).parent().children().animate({"opacity": "1.0"}, 00);
		});


	});

	$(function() {
		$(".close").click(function() {
			// console.log($(this).parent());
			$(".close").parent().parent().slideUp(); // <center> is considered the parent due to it being the immediate wrapping HTML element
			$("#navi").animate({"top": "20%"}, "slow");
		});	
	});

});