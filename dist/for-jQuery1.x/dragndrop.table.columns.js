/*global $:false, jQuery:false*/
/*
Drag & Drop Table Columns v.0.1.5
by Oleksandr Nikitin (a.nikitin@i.ua)
https://github.com/alexshnur/drag-n-drop-table-columns
*/
(function($, window){
	var cols, dragSrcEl = null, dragSrcEnter = null, dragableColumns, _this;

	function insertAfter(elem, refElem) {
		return refElem.parentNode.insertBefore(elem, refElem.nextSibling);
	}

	function isIE () {
		var nav = navigator.userAgent.toLowerCase();
		return (nav.indexOf('msie') !== -1) ? parseInt(nav.split('msie')[1]) : false;
	}

	dragableColumns = (function(){
		var $table;
		function dragColumns (table, options) {
			_this = this;
			$table = table;
			_this.options = $.extend({}, _this.options, options);
			if (_this.options.drag) {
				if (isIE() === 9) {
					$table.find('thead tr th:not(.no-drag)').each(function(){
						if ($(this).find('.drag-ie').length === 0) {
							$(this).html($('<a>').html($(this).html()).attr('href', '#').addClass('drag-ie'));
						}
					});
				}
				cols = $table.find('thead tr th:not(.no-drag)');

				jQuery.event.props.push('dataTransfer');
				[].forEach.call(cols, function(col){
					col.setAttribute('draggable', true);

					$(col).on('dragstart', _this.handleDragStart);
					$(col).on('dragenter', _this.handleDragEnter);
					$(col).on('dragover', _this.handleDragOver);
					$(col).on('dragleave', _this.handleDragLeave);
					$(col).on('drop', _this.handleDrop);
					$(col).on('dragend', _this.handleDragEnd);
				});
			}
		}

		dragColumns.prototype = {
			options: {
				drag: true,
				dragClass: 'drag',
				overClass: 'over',
				movedContainerSelector: '.dnd-moved',
				additionalTableSelector: null
			},
			handleDragStart: function(e) {
				$(this).addClass(_this.options.dragClass);
				dragSrcEl = this;
				e.dataTransfer.effectAllowed = 'copy';
				e.dataTransfer.setData('text/html', this.id);
			},
			handleDragOver: function (e) {
				if (e.preventDefault) {
					e.preventDefault();
				}
				e.dataTransfer.dropEffect = 'copy';
				return;
			},
			handleDragEnter: function (e) {
				dragSrcEnter = this;
				[].forEach.call(cols, function (col) {
					$(col).removeClass(_this.options.overClass);
				});
				$(this).addClass(_this.options.overClass);
				return;
			},
			handleDragLeave: function (e) {
				if (dragSrcEnter !== e) {
					//this.classList.remove(_this.options.overClass);
				}
			},
			handleDrop: function (e) {
				if (e.stopPropagation) {
					e.stopPropagation();
				}
				if (dragSrcEl !== e) {
					_this.moveColumns($(dragSrcEl).index(), $(this).index());
				}
				return;
			},
			handleDragEnd: function (e) {
				var colPositions = {
					array: [],
					object: {}
				};
				[].forEach.call(cols, function (col) {
					var name = $(col).attr('data-name') || $(col).index();
					$(col).removeClass(_this.options.overClass);
					colPositions.object[name] = $(col).index();
					colPositions.array.push($(col).index());
				});
				if (typeof _this.options.onDragEnd === 'function') {
					_this.options.onDragEnd(colPositions);
				}
				$(dragSrcEl).removeClass(_this.options.dragClass);
				return;
			},
			moveColumns: function (fromIndex, toIndex) {
				var rows = $table.find(_this.options.movedContainerSelector);
				for (var i = 0; i < rows.length; i++) {
					if (toIndex > fromIndex) {
						insertAfter(rows[i].children[fromIndex], rows[i].children[toIndex]);
					} else if (toIndex < $table.find('thead tr th').length - 1) {
						rows[i].insertBefore(rows[i].children[fromIndex], rows[i].children[toIndex]);
					}
				}

				if (_this.options.additionalTableSelector != null) {
					var originalTable = $table;

					$table = $(_this.options.additionalTableSelector);

					var rows = $table.find(_this.options.movedContainerSelector);
					for (var i = 0; i < rows.length; i++) {
						if (toIndex > fromIndex) {
							insertAfter(rows[i].children[fromIndex], rows[i].children[toIndex]);
						} else if (toIndex < $table.find('th, td').length - 1) {
							rows[i].insertBefore(rows[i].children[fromIndex], rows[i].children[toIndex]);
						}
					}

					$table = originalTable;
				}
			}
		};

		return dragColumns;

	})();

	return $.fn.extend({
		dragableColumns: function(){
			var option = (arguments[0]);
			return this.each(function() {
				var $table = $(this);
				new dragableColumns($table, option);
			});
		}
	});

})(window.jQuery, window);