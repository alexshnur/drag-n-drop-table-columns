/*global $:false, jQuery:false*/
(function($, window){
	var cols, dragSrcEl = null, dragSrcEnter = null, dragableColumns, _this;

	function insertAfter(elem, refElem) {
		return refElem.parentNode.insertBefore(elem, refElem.nextSibling);
	}

	dragableColumns = (function(){
		function dragableColumns (table) {
			if (this.options.drag) {
				_this = this;
				console.log(_this.options.dragClass);
				cols = document.querySelectorAll(_this.options.tableClass + ' thead tr th');
				jQuery.event.props.push('dataTransfer');
				[].forEach.call(cols, function(col){
					col.setAttribute('draggable', true);
					col.addEventListener('dragstart', _this.handleDragStart, false);
					col.addEventListener('dragenter', _this.handleDragEnter, false);
					col.addEventListener('dragover', _this.handleDragOver, false);
					col.addEventListener('dragleave', _this.handleDragLeave, false);
					col.addEventListener('drop', _this.handleDrop, false);
					col.addEventListener('dragend', _this.handleDragEnd, false);
				});
			}
		}

		dragableColumns.prototype = {
			options: {
				drag: true,
				dragClass: 'drag',
				overClass: 'over',
				tableClass: '.table',
				trMovedClass: '.dnd-moved'
			},
			handleDragStart: function(e) {
				this.classList.add(_this.options.dragClass);
				dragSrcEl = this;
				e.dataTransfer.effectAllowed = 'move';
				e.dataTransfer.setData('text/html', this.innerHTML);
			},
			handleDragOver: function (e) {
				if (e.preventDefault) {
					e.preventDefault();
				}
				e.dataTransfer.dropEffect = 'move';
				return false;
			},
			handleDragEnter: function (e) {
				dragSrcEnter = this;
				[].forEach.call(cols, function (col) {
					col.classList.remove(_this.options.overClass);
				});
				this.classList.add(_this.options.overClass);
			},
			handleDragLeave: function (e) {
				if (dragSrcEnter !== e) {
					this.classList.remove(_this.options.overClass);
				}
			},
			handleDrop: function (e) {
				if (e.stopPropagation) {
					e.stopPropagation();
				}
				if (dragSrcEl !== e) {
					_this.moveColumns($(dragSrcEl).index(), $(this).index());
				}
				return false;
			},
			handleDragEnd: function (e) {
				[].forEach.call(cols, function (col) {
					col.classList.remove(_this.options.overClass);
				});
				dragSrcEl.classList.remove(_this.options.dragClass);
			},
			moveColumns: function (fromIndex, toIndex) {
				var rows = $(_this.options.tableClass).find(_this.options.trMovedClass);
				console.log(rows);
				for (var i = 0; i < rows.length; i++) {
					if (toIndex > fromIndex) {
						insertAfter(rows[i].children[fromIndex], rows[i].children[toIndex]);
					} else if (toIndex < $(_this.options.tableClass).find('thead tr th').length - 1) {
						rows[i].insertBefore(rows[i].children[fromIndex], rows[i].children[toIndex]);
					}
				}
			}
		};

		return dragableColumns;

	})();
	/*Drag and Drop Table Columns*/
	return $.fn.extend({
		dragableColumns: function(){
			return this.each(function() {
				var $table = $(this), data;
				console.log(this);
				data = new dragableColumns($table);
			});
		}
	});

})(window.jQuery, window);