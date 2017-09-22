Drag & Drop Table Columns
=========================

Demo page http://alexshnur.github.io/drag-n-drop-table-columns/

Work in IE9+, Google Chrome, Mozzila Firefox

	<div class="table-responsive container">
		<table class="table table-bordered">
			<thead>
				<tr class="dnd-moved">
					<th>Column #1</th>
					<th>Column #2</th>
					<th>Column #3</th>
					<th>Column #4</th>
					<th>Column #5</th>
				</tr>
			</thead>
			<tbody>
				<tr class="dnd-moved">
					<td>Row #1-1</td>
					<td>Row #1-2</td>
					<td>Row #1-3</td>
					<td>Row #1-4</td>
					<td>Row #1-5</td>
				</tr>
				<tr class="dnd-moved">
					<td>Row #2-1</td>
					<td>Row #2-2</td>
					<td>Row #2-3</td>
					<td>Row #2-4</td>
					<td>Row #2-5</td>
				</tr>
				<tr class="dnd-moved">
					<td>Row #3-1</td>
					<td>Row #3-2</td>
					<td>Row #3-3</td>
					<td>Row #3-4</td>
					<td>Row #3-5</td>
				</tr>
			</tbody>
		</table>
	</div>
	
To use jQuery 1.x

	<script src="js/jquery-1.11.0.min.js" type="text/javascript"></script>
	<script src="dist/for-jQuery1.x/dragndrop.table.columns.min.js" type="text/javascript"></script>
	<script>
		$('.table').dragableColumns();
	</script>

To use jQuery 3.x

	<script src="js/jquery-3.2.1.slim.min.js"></script>
	<script src="dist/for-jQuery3.x/dragndrop.table.columns.min.js" type="text/javascript"></script>
	<script>
		$('.table').dragableColumns();
	</script>
	
Parameters

**drag** - default boolean true.

**dragClass** - this is class for drag event default 'drag'.

**overClass** - this is class for over event default 'over'.

**movedContainerSelector** - default '.dnd-moved'.

**onDragEnd** - this is the function to which the parameter is passed `colPositions = {array: [], object: {}}`.
