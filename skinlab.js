
//스크롤 내리면 색깔 들어가는 효과
	var $tmp = $(window).scrollTop();
			var target = $('.subColor');			

			if ($('.subColor').length > 0){
				var offset = target.offset().top;
				var height = target.outerHeight();
				var range = '';
				offset = offset + height / 1.55;
				var winWidth = $(window).width();
				if (winWidth > 479){ range = 300; } else { range = 100; }
				
				if ($tmp < offset){
					var calc = ($tmp - offset + range) / range;
					target.css({ 'opacity': calc });
				  
					if ( calc > '0.5' ) {
					  target.css({ 'opacity': 0.5 });
					} else if ( calc < '0' ) {
					  target.css({ 'opacity': 0 });
					}
				}
			}
//스크롤 내리면 색깔 들어가는 효과 끝

