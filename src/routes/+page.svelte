<script lang="ts">
	import '@fontsource/poppins';
	import 'material-icons/iconfont/material-icons.css';
	import Cell from '../components/Cell.svelte';
	import Minesweeper from '../utils/Minesweeper';

	const gameOngoing = 'sentiment_satisfied';
	const gameOverIcon = 'sentiment_very_dissatisfied';
	const gameWinIcon = 'mood';

	let game = new Minesweeper();
	let seconds = 0;
	let intervalID: NodeJS.Timeout;

	game.resetBoard();
	game.funcsToRunOnReset.push(() => {
		seconds = 0;
		clearInterval(intervalID);
	});

	const clickSpot = (e: MouseEvent, row: number, column: number) => {
		if (game.gameState !== 0) {
			return;
		}
		if (seconds == 0) {
			intervalID = setInterval(() => {
				if (game.gameState === 0) {
					seconds += 1;
				}
			}, 1000);
		}
		if (game.playBoard[row][column] !== undefined && e.button == 0) {
			return;
		}
		if (e.button == 2) {
			game.toggleFlag(row, column);
			game = game;
			return;
		}
		if (e.button == 0) {
			game.revealSpot(row, column);
			game = game;
		}
	};
</script>

<main on:contextmenu|preventDefault>
	<h1>Minesweeper</h1>
	<div class="scoreboard">
		<input
			type="button"
			value={game.gameState >= 0 ? (game.gameState > 0 ? gameWinIcon : gameOngoing) : gameOverIcon}
			class="reset material-icons-outlined"
			on:click={() => {
				game.resetBoard();
				game = game;
			}}
		/>
		<div>
			{#if game.gameState == 1}<h2>You Win in {seconds} Seconds</h2> {:else} {seconds} {/if}
		</div>
	</div>
	<div class="gameboard">
		{#if game.board}
			<table>
				{#each game.playBoard as row, rowIndex}
					<tr>
						{#each row as cell, columnIndex}
							<Cell {cell} {rowIndex} {columnIndex} playBoard={game.playBoard} {clickSpot} />
						{/each}
					</tr>
				{/each}
			</table>
		{/if}
	</div>
	<div class="flagCounter">
		<span class="material-icons">flag</span>'s to place: {game.mineCounter}
	</div>
	<div>
		<h2>Settings</h2>
		<div>
			{game.error ?? ''}
		</div>
		<div>
			Presets: <select
				value="1"
				on:change={(e) => {
					switch (e.currentTarget.value) {
						case '0':
							game.resetBoard(10, 10, 10);
							break;
						case '2':
							game.resetBoard(16, 30, 99);
							break;
						default:
							game.resetBoard(16, 16, 40);
					}
					game = game;
				}}
			>
				<option value="0">Easy</option>
				<option value="1">Medium</option>
				<option value="2">Hard</option>
			</select>
		</div>
		<div>
			Rows:<input
				type="number"
				bind:value={game.rows}
				min="2"
				on:change={() => {
					game.resetBoard();
					game = game;
				}}
			/>
		</div>
		<div>
			Columns:
			<input
				type="number"
				bind:value={game.columns}
				min="2"
				on:change={() => {
					game.resetBoard();
					game = game;
				}}
			/>
		</div>
		Mines:<input
			type="number"
			bind:value={game.mines}
			min="1"
			on:change={() => {
				game.resetBoard();
				game = game;
			}}
		/>
	</div>
</main>

<style lang="scss">
	:global(body) {
		margin: 0;
	}
	main {
		min-height: 100vh;
		font-family: 'Poppins', sans-serif;
		background: rgb(125, 169, 252);
		background: linear-gradient(343deg, rgba(125, 169, 252, 1) 0%, rgba(83, 204, 245, 1) 100%);
	}

	h1 {
		text-align: center;
		margin: 0 0 5px 0;
	}
	.scoreboard {
		display: flex;
		flex-direction: column;
		align-items: center;
		font-size: 24px;

		& > {
			width: max-content;
		}

		input {
			font-size: 32px;
			background-color: yellow;
			border-radius: 5px;
			border: outset;
			cursor: pointer;

			&:hover {
				border: inset;
			}
		}
	}

	.gameboard {
		display: flex;
		flex-direction: column;
		align-items: center;

		table {
			background: black;
		}
	}

	.flagCounter {
		margin: 15px 0;
		display: flex;
		justify-content: center;
		font-size: 24px;
		align-items: center;

		span {
			font-size: 28px;
		}
	}
</style>
