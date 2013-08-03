// jquery-ui-icon
// Author: Casey Trimm
// Created: May 2010
(function( $ ) {
	var prefix = "ui-icon-";
	
	function doHover(self) {
		// If we have a hover icon, use it, else just activate the "active state" of the wrapper.
		if (self.options.hoverIcon.length > 0) {
			self.element.toggleClass(prefix + self.options.hoverIcon);
			self.element.toggleClass(prefix + self.options.icon);
		}
		else {
			self.wrapper.toggleClass("ui-state-active");
		}
	}

	$.widget("ui.icon", {
		options : {
			icon : "link",
			hoverIcon : "",
			wrapperClass : ""
		},

		_create : function() {
			var self = this, ops = this.options, el = this.element;
			
			// Set options based on options that were passed.
			this.options.icon = (ops.icon) ? ops.icon : this.options.icon;
			this.options.hoverIcon = (ops.hoverIcon) ? ops.hoverIcon : this.options.hoverIcon;
			this.options.wrapperClass = (ops.wrapperClass) ? ops.wrapperClass : this.options.wrapperClass;

			// Add the icon classes
			el.addClass("ui-icon").addClass(prefix + this.options.icon);
			
			// Wrap it in an outer span; this is for positioning and to apply the active state
			el.wrap("<span style='border: 0;' />");
			this.wrapper = el.parent();
			this.wrapper.addClass(this.options.wrapperClass);
			
			// Bindings for hovering
			this.wrapper.bind("mouseover", function() {
				doHover(self);
			});
			this.wrapper.bind("mouseout", function() {
				doHover(self);
			});
			
			return this;
		},

		destroy : function() {
			this.wrapper.after(this.element);
			this.wrapper.remove();
			this.element.removeClass("ui-icon");
			this.element.removeClass(prefix + this.options.icon);
		},
		
		// Getter for wrapper element
		wrapper : function() {
			return this.wrapper;
		},
		
		_setOption : function(key, value) {
			switch(key) {
				// Update the element class
				case "icon":
					this.element.removeClass(prefix + this.options.icon);
					this.element.addClass(prefix + value);
					break;
				
				// Do nothing, this is only used when hovering
				case "hoverIcon":
					break;
				
				// Update the wrapper class
				case "wrapperClass":
					this.wrapper.removeClass(this.options.wrapperClass);
					this.wrapper.addClass(value);
					break;
				
				// There are no other options
				default:
					throw Error("Invalid Option!");
			}
			
			this.options[key] = value;
		}
	}); 
})(jQuery);
