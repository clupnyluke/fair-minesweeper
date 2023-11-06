<script lang="ts">
	export let cell: string | number | undefined;
	export let rowIndex: number;
	export let columnIndex: number;
	export let playBoard: (typeof cell)[][];
	export let clickSpot: (e: MouseEvent, row: number, column: number) => void;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<td
	class={`cell cell-${
		playBoard[rowIndex][columnIndex] == 'flag'
			? 'flag'
			: playBoard[rowIndex][columnIndex] ?? 'unknown'
	} ${
		playBoard[rowIndex][columnIndex] == 'flag' || playBoard[rowIndex][columnIndex] == 'dangerous'
			? ' material-icons'
			: ''
	}`}
	on:mousedown={(e) => {
		clickSpot(e, rowIndex, columnIndex);
	}}
	on:contextmenu|preventDefault
>
	{cell ?? ' '}
</td>

<style lang="scss">
	td {
		user-select: none;
		cursor: pointer;
		border: outset 3px;
		width: 30px;
		height: 30px;
		text-align: center;

		&:hover {
			border: inset 3px;
		}
	}

	td.material-icons {
		display: table-cell;
		line-height: normal;
	}

	.cell-dangerous {
		border-color: red;
		background-color: red;
	}

	.cell-unknown {
		border-color: gray;
		background: gray;
	}

	.cell-flag {
		border-color: yellow;
		background-color: yellow;
	}

	.cell-0 {
		background-color: #fff;
		color: #fff;
	}

	.cell-1 {
		border-color: #07119c;
		background-color: #07119c;
		color: #fff;
	}

	.cell-2 {
		border-color: #125f03;
		background-color: #125f03;
		color: #fff;
	}

	.cell-3 {
		border-color: #c27b11;
		background-color: #c27b11;
		color: #fff;
	}

	.cell-4 {
		border-color: #9f11c2;
		background-color: #9f11c2;
		color: #fff;
	}

	.cell-5 {
		border-color: #068cca;
		background-color: #068cca;
		color: #ffffff;
	}

	.cell-6 {
		border-color: #441f05;
		background-color: #441f05;
		color: #ffffff;
	}

	.cell-7 {
		border-color: #350544;
		background-color: #350544;
		color: #ffffff;
	}

	.cell-8 {
		border-color: #ffffff;
		background-color: #ce31b4;
		color: #ffffff;
	}
</style>
