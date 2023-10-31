<script lang="ts">
	let rows = 16;
	let columns = 16;
	let mines = 40;

	let board: number[][];
	let playBoard: (number | string | undefined)[][];

	let mineCounter = mines;
	let spotCounter = rows * columns - mines;
	let error: string | undefined;
	let gameState = 0;

	function* shuffle(array: number[]) {
		let i = array.length + 1;

		while (i--) {
			yield array.splice(Math.floor(Math.random() * i), 1)[0];
		}
	}

	const countBombs = (row: number, column: number) => {
		let count = 0;
		if (board[row][column] === -1) {
			return -1;
		}

		for (let i = -1; i <= 1; i++) {
			for (let j = -1; j <= 1; j++) {
				if ((board[row + i] ?? [])[column + j] === -1) count++;
			}
		}
		return count;
	};

	const resetBoard = () => {
		gameState = 0;
		spotCounter = rows * columns - mines;
		mineCounter = mines;
		if (rows * columns - mines < 1) {
			error = 'INVALID BOARD';
			return;
		}
		error = '';
		board = [];
		playBoard = [];
		for (let i = 0; i < rows; i++) {
			board[i] = new Array(columns);
			playBoard[i] = new Array(columns);
		}
		const possibleValues = new Array(rows * columns).fill(0).map((_, i) => i);
		const spots = shuffle(possibleValues);
		for (let i = 0; i < mines; i++) {
			const spot = spots.next().value as number;
			const row = Math.floor(spot / columns);
			const column = spot % columns;
			board[row][column] = -1;
		}
		let row = 0;
		let column = -1;
		for (let i = 0; i < rows * columns; i++) {
			if (column == columns - 1) {
				row++;
				column = -1;
			}
			column++;
			board[row][column] = countBombs(row, column);
		}
	};
	resetBoard();

	const revealSpot = (row: number, column: number) => {
		const val = board[row][column];
		if (val === -1) {
			playBoard[row][column] = 'X';
			gameState = -1;
			return;
		}
		spotCounter--;
		if (spotCounter == 0) {
			gameState = 1;
		}

		playBoard[row][column] = board[row][column];
		if (val === 0) {
			for (let i = -1; i <= 1; i++) {
				for (let j = -1; j <= 1; j++) {
					if (row + i < 0 || row + i == rows) continue;
					if (column + j < 0 || column + j == columns) continue;
					if (playBoard[row + i][column + j] !== undefined) continue;
					revealSpot(row + i, column + j);
				}
			}
		}
		playBoard[row][column] = board[row][column];
	};

	const clickSpot = (e: MouseEvent, row: number, column: number) => {
		if (gameState !== 0) {
			return;
		}
		if (playBoard[row][column] !== undefined && e.button == 0) {
			return;
		}
		if (e.button == 2) {
			if (playBoard[row][column] == undefined) {
				playBoard[row][column] = '!';
				mineCounter--;
				return;
			}
			if (playBoard[row][column] === '!') {
				playBoard[row][column] = undefined;
				mineCounter++;
			}
			return;
		}
		if (e.button == 0) {
			revealSpot(row, column);
		}
	};
</script>

<main>
	<div>
		Rows: <input type="number" bind:value={rows} min="2" on:change={() => resetBoard()} />
		Columns: <input type="number" bind:value={columns} min="2" on:change={() => resetBoard()} />
		Mines:<input type="number" bind:value={mines} min="1" on:change={() => resetBoard()} />
		<input type="button" value="Reset" on:click={() => resetBoard()} />
	</div>
	<div>
		{error ?? ''}
	</div>
	<div>
		{#if board}
			<table>
				{#each playBoard as row, rowIndex}
					<tr>
						{#each row as cell, columnIndex}
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<td
								class={`cell cell-${
									playBoard[rowIndex][columnIndex] == '!'
										? 'flag'
										: playBoard[rowIndex][columnIndex] ?? 'unknown'
								}`}
								on:mousedown={(e) => {
									clickSpot(e, rowIndex, columnIndex);
								}}
								on:contextmenu|preventDefault
							>
								{cell ?? ' '}
							</td>
						{/each}
					</tr>
				{/each}
			</table>
		{/if}
	</div>
	<div>
		Mines Left: {mineCounter}
	</div>
	{#if gameState}
		<h1>
			{gameState === 1 ? 'You Win' : 'You Lose'}
		</h1>
	{/if}
</main>

<style lang="scss">
	td {
		border: inset 2px;
		width: 30px;
		height: 30px;
		text-align: center;
	}

	.cell-X {
		border: outset 3px red;
		background-color: red;
	}

	.cell-unknown {
		border: outset 3px gray;
		background: gray;
	}

	.cell-flag {
		border: outset 3px yellow;
		background-color: yellow;
	}

	.cell-1 {
		border: outset 3px #07119c;
		background-color: #07119c;
		color: #fff;
	}

	.cell-2 {
		border: outset 3px #125f03;
		background-color: #125f03;
		color: #fff;
	}

	.cell-3 {
		border: outset 3px #c27b11;
		background-color: #c27b11;
		color: #fff;
	}

	.cell-4 {
		border: outset 3px #9f11c2;
		background-color: #9f11c2;
		color: #fff;
	}

	.cell-5 {
		border: outset 3px #068cca;
		background-color: #068cca;
		color: #ffffff;
	}

	.cell-6 {
		border: outset 3px #441f05;
		background-color: #441f05;
		color: #ffffff;
	}

	.cell-7 {
		border: outset 3px #350544;
		background-color: #350544;
		color: #ffffff;
	}

	.cell-8 {
		border: outset 3px #ffffff;
		background-color: #ce31b4;
		color: #ffffff;
	}
</style>
