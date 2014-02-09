/*global $:false, jQuery:false, bka:false, ansi_up:false*/
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	__slice = [].slice;

(function($, window) {
	var ResizableColumns, parseWidth, pointerX, setWidth, parseMinWidth;
	parseWidth = function(node) {
		return parseFloat(node.style.width.replace('px', ''));
	};
	parseMinWidth = function(node) {
		return parseFloat(node.style.minWidth.replace('px', ''));
	};
	setWidth = function(node, width) {
		width = width.toFixed(0);
		$(node).attr('data-width', width);
		return $(node).css({width: width + 'px'});
	};
	pointerX = function(e) {
		if (e.type.indexOf('touch') === 0) {
			return (e.originalEvent.touches[0] || e.originalEvent.changedTouches[0]).pageX;
		}
		return e.pageX;
	};
	ResizableColumns = (function() {
		function ResizableColumns ($table, options) {
			this.pointerDown = __bind(this.pointerDown, this);
			var _this = this;
			this.options = $.extend({}, this.defaults, options);
			this.$table = $table;
			this.setHeaders();
			this.restoreColumnWidths();
			this.syncHandleWidths();
			$(window).on('resize.rc', (function() {
				return _this.syncHandleWidths();
			}));
		}

		ResizableColumns.prototype = {
			defaults: {
				store: window.store,
				rigidSizing: false,
				resizeFromBody: true
			},

			getColumnId: function($el) {
				return this.$table.data('resizable-columns-id') + '-' + $el.data('resizable-column-id');
			},

			setHeaders: function() {
				this.$tableHeaders = this.$table.find('tr th');
				this.assignPercentageWidths();
				return this.createHandles();
			},

			destroy: function() {
				this.$handleContainer.remove();
				this.$table.removeData('resizableColumns');
				return $(window).off('.rc');
			},

			assignPercentageWidths: function() {
				var _this = this;
				return this.$tableHeaders.each(function(_, el) {
					var $el;
					$el = $(el);
					return setWidth($el[0], $el.outerWidth());
				});
			},

			createHandles: function() {
				var _this = this;

				if (this.$handleContainer) {
					$('.rc-handle-container').remove();
				}
				this.$handleContainer = $("<div class='rc-handle-container' />");
				this.$table.before(this.$handleContainer);
				this.$tableHeaders.each(function(i, el) {
					var $handle;
					if (_this.$tableHeaders.eq(i + 1).length === 0 || (_this.$tableHeaders.eq(i).attr('data-noresize')) || (_this.$tableHeaders.eq(i + 1).attr('data-noresize'))) {
						return;
					}
					$handle = $("<div class='rc-handle' />");
					$handle.data('th', $(el));
					return $handle.appendTo(_this.$handleContainer);
				});
				return this.$handleContainer.on('mousedown touchstart', '.rc-handle', this.pointerDown);
			},

			syncHandleWidths: function() {
				var _this = this;
				this.setHeaders();
				return this.$handleContainer.width(this.$table.width()).find('.rc-handle').each(function(_, el) {
					var $el;
					$el = $(el);
					var leftPosition = $el.data('th').outerWidth() + ($el.data('th').offset().left - _this.$handleContainer.offset().left);
					return $el.css({
						left: leftPosition.toFixed(0) + 'px',
						height: _this.options.resizeFromBody ? _this.$table.height() : _this.$table.find('thead').height()
					});
				});
			},

			saveColumnWidths: function() {
				var _this = this;
				return this.$tableHeaders.each(function(_, el) {
					var $el;
					$el = $(el);
					if (!$el.attr('data-noresize')) {
						if (_this.options.store) {
							return _this.options.store.set(_this.getColumnId($el), parseWidth($el[0]));
						}
					}
				});
			},

			restoreColumnWidths: function() {
				var _this = this;
				return this.$tableHeaders.each(function(_, el) {
					var $el, width;
					$el = $(el);
					if (_this.options.store && (width = _this.options.store.get(_this.getColumnId($el)))) {
						return setWidth($el[0], width);
					}
				});
			},

			pointerDown: function(e) {
				var $currentGrip, $leftColumn, $rightColumn, startPosition, widths,
					_this = this, saveLeft, saveRight, isDifference = true,
					saveDifference;
				e.preventDefault();
				startPosition = pointerX(e);
				$currentGrip = $(e.currentTarget);
				$leftColumn = $currentGrip.data('th');
				$rightColumn = this.$tableHeaders.eq(this.$tableHeaders.index($leftColumn) + 1);
				widths = {
					left: parseWidth($leftColumn[0]),
					right: parseWidth($rightColumn[0]),
					minWidth: parseMinWidth($leftColumn[0]),
					maxWidth: parseMinWidth($rightColumn[0])
				};
				this.$table.addClass('rc-table-resizing');
				$(document).on('mousemove.rc touchmove.rc', function(e) {
					var difference;
					difference = (pointerX(e) - startPosition);
					if (widths.minWidth >= (difference + widths.left)) {
						difference = widths.minWidth - widths.left;
					}
					if (widths.maxWidth >= (widths.right - difference)) {
						difference = widths.right - widths.maxWidth;
					}
					if ((widths.left + widths.right) === ($($leftColumn[0]).outerWidth() + $($rightColumn[0]).outerWidth()) && isDifference) {
						saveDifference = difference;
						saveLeft = $($leftColumn[0]).outerWidth();
						saveRight = $($rightColumn[0]).outerWidth();
						setWidth($rightColumn[0], widths.right - difference);
						setWidth($leftColumn[0], widths.left + difference);
					} else {
						if (saveDifference > 0) {
							isDifference = saveDifference >= difference ? true : false;
						} else {
							isDifference = saveDifference <= difference ? true : false;
						}
						setWidth($rightColumn[0], saveRight);
						setWidth($leftColumn[0], saveLeft);
					}
				});
				return $(document).one('mouseup touchend', function() {
					$(document).off('mousemove.rc touchmove.rc');
					_this.$table.removeClass('rc-table-resizing');
					_this.syncHandleWidths();
					_this.saveColumnWidths();
					bka.newColumnsParamForSave();
				});
			}
		};

		return ResizableColumns;

	})();
	return $.fn.extend({
		resizableColumns: function() {
			var args, option;
			option = (arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : []);
			return this.each(function() {
				var $table, data;
				$table = $(this);
				data = new ResizableColumns($table, option);
				/*
				 data = $table.data('resizableColumns');
				 if (!data) {
				 $table.data('resizableColumns', (data = new ResizableColumns($table, option)));
				 }
				 if (option instanceof String) {
				 return data[option].apply(data, args);
				 }*/
			});
		}
	});
})(window.jQuery, window);