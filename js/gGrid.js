Ggrid = {
	init : function (image, gridIndex, options) {
		this.gridW = image.width();
	 	this.gridH = image.height();
	 	if(image.data('cell')){
	 		this.cellPerRow = image.data('cell');
	 	}else{
	 		this.cellPerRow = options.cellPerRow;
	 	}
	 	this.bg = image.attr('src');

	 	image.before($('<div class="gGrid" data-cell="'+this.cellPerRow+'"></div>'));

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
	 			cell = $('<div></div>').attr('class', 'cell').attr('id', 'grid'+gridIndex+'cell'+self.currentRow+'-'+i)
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
 			cell = $('<div></div>').attr('class', 'cell').attr('id', 'grid'+gridIndex+'cell'+self.currentRow+'-'+i)
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
		cellPerRow: 8
	};  
    
  	var options = $.extend(defaults, options);  
  
    return this.each(function() {  
    	obj = $(this); 
  		
  		gGrid = Ggrid;						
		gGrid.init(obj, gGrids.length, options);								
		gGrids.push($.extend({}, gGrid));

		$(window).scroll(function() {
			visibleAreaTop = $(window).scrollTop();
			visibleAreaBottom = $(window).scrollTop() + $(window).height();

			//for each grid
			for(g = 0; g < gGrids.length; g++){
				currentGrid = gGrids[g];
				if(currentGrid.isFadedIn == false){
					for (i = 1; i <= currentGrid.totalRaws; i++) {
		 			//if row is displayed in window
		 			if((visibleAreaBottom >  $('#grid'+g+'cell'+i+'-0').offset().top) && (visibleAreaTop < $('#grid'+g+'cell'+i+'-0').offset().top)){
		 				//if not already visible
		 				if($('#grid'+g+'cell'+i+'-0').css('opacity') != 1){
		 					for (j = 0; j < currentGrid.cellPerRow; j++) {
		 						delay = (randomXToY(options.minDelay, options.maxDelay, 2))+'s';
		 						$('#grid'+g+'cell'+i+'-'+j).css('-moz-transition-delay', delay)
		 										  .css('-webkit-transition-delay', delay)
		 										  .css('-o-transition-delay', delay)
		 										  .css('transition-delay', delay);
								$('#grid'+g+'cell'+i+'-'+j).css('opacity', 1);
							};
		 				}				
					}
		 		};
				}
			}
		});

		$(window).scroll();
	});  
};  
})(jQuery); 