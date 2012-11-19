Ggrid = {
	init : function (image, gridIndex, options) {
		this.gridW = image.width();
	 	this.gridH = image.height();
	 	if(image.data('cellperrow')){
	 		this.cellPerRow = image.data('cellperrow');
	 	}else{
	 		this.cellPerRow = options.cellPerRow;
	 	}
	 	this.bg = image.attr('src');

	 	image.before($('<div class="gGrid" data-cellperrow="'+this.cellPerRow+'"></div>'));

			this.grid = image.prev();
			this.grid.css({'width': this.gridW+'px', 'height': this.gridH+'px'});

			image.remove();

	 	this.cellSize = Math.round(this.gridW / this.cellPerRow);

	 	this.grid.css('height', this.gridH+'px');

	 	this.currentRow = 1;
	 	this.totalRaws = 1;
	 	this.isFadedIn = false;

	 	this.makeBoxes(gridIndex);
 	},

 	makeBoxes : function (gridIndex) {
 		var self = this;
 		while(self.gridH > (self.currentRow * self.cellSize)){
	 		for (i = 0; i < self.cellPerRow; i++) {
	 			offsetW = i * self.cellSize;
	 			offsetH = (self.currentRow - 1) * self.cellSize;
	 			cell = $('<div></div>').attr('class', 'cell hidden').attr('id', 'grid'+gridIndex+'cell'+self.currentRow+'-'+i)
	 								   .width(self.cellSize).height(self.cellSize)
	 								   .css('left', offsetW).css('top', offsetH)
	 								   .css('opacity', 0);
	 			cell.css('background', 'url('+self.bg+') -'+offsetW+'px -'+offsetH+'px');
	 			self.grid.append(cell);
	 		};
	 		self.currentRow = self.currentRow + 1;
	 	}
	 	for (i = 0; i < self.cellPerRow; i++) {
 			offsetW = i * self.cellSize;
 			offsetH = (self.currentRow - 1) * self.cellSize;
 			cell = $('<div></div>').attr('class', 'cell hidden').attr('id', 'grid'+gridIndex+'cell'+self.currentRow+'-'+i)
 								   .width(self.cellSize).height(self.cellSize)
 								   .css('left', offsetW).css('top', offsetH)
 								   .css('opacity', 0);
 			cell.css('background', 'url('+self.bg+') -'+offsetW+'px -'+offsetH+'px');
 			self.grid.append(cell);		
 		};

	 	self.totalRaws = self.currentRow;
	}
};

function randomXToY(minVal,maxVal,floatVal)
{
	var randVal = minVal+(Math.random()*(maxVal-minVal));
	return typeof floatVal=='undefined'?Math.round(randVal):randVal.toFixed(floatVal);
}

(function($){  
 $.fn.gGrid = function(options) {  
 	var gGrids = [];

	var defaults = {  
		minDelay: 0,
		maxDelay: 1.5,
		cellPerRow: 8,
		fadeDuration: 1
	};  
    
  	var options = $.extend(defaults, options);  
  	
  	var timer;

    $(window).scroll(function() {
    	clearTimeout(timer);
        timer = setTimeout( refreshScroll , 50 );
	});

	function refreshScroll() {
		visibleAreaTop = $(window).scrollTop();
		visibleAreaBottom = $(window).scrollTop() + $(window).height();

		//for each grid
		for(g = 0; g < gGrids.length; g++){
			currentGrid = gGrids[g];
				for (i = 1; i <= currentGrid.totalRaws; i++) {
		 			//if row is displayed in window
		 			if((visibleAreaBottom >  $('#grid'+g+'cell'+i+'-0').offset().top) && (visibleAreaTop < $('#grid'+g+'cell'+i+'-0').offset().top)){
		 				//if not already visible
		 				if($('#grid'+g+'cell'+i+'-0').hasClass('hidden')){
		 					for (j = 0; j < currentGrid.cellPerRow; j++) {
		 						//we remove 'hidden' class to precise that the row is already set & fading in
		 						$('#grid'+g+'cell'+i+'-'+j).removeClass('hidden');
		 						delay = (randomXToY(options.minDelay, options.maxDelay, 2))+'s';
		 						//setting transition inline
		 						transitionString = '-moz-transition: opacity '+options.fadeDuration+'s ease '+delay+';-webkit-transition: opacity '+options.fadeDuration+'s ease '+delay+';-o-transition: opacity '+options.fadeDuration+'s ease '+delay+';transition: opacity '+options.fadeDuration+'s ease '+delay+';';
		 						//setting background size
		 						backgroundSizeString = 'background-size: '+currentGrid.gridW+'px '+currentGrid.gridH+'px;';
		 						//updating the style	 						
		 						$('#grid'+g+'cell'+i+'-'+j).attr('style', $('#grid'+g+'cell'+i+'-'+j).attr('style') + transitionString + backgroundSizeString);
								$('#grid'+g+'cell'+i+'-'+j).css('opacity', 1);
							};
		 				}				
					}
		 		}
		}
	}

	$(window).scroll();

	return this.each(function() {  
    	$this = $(this);  		
  		gGrid = Ggrid;
		gGrid.init($this, gGrids.length, options);								
		gGrids.push($.extend({}, gGrid));
	});
};  
})(jQuery); 