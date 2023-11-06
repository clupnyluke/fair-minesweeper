function* shuffle(array: number[]) {
	let i = array.length + 1;

	while (i--) {
		yield array.splice(Math.floor(Math.random() * i), 1)[0];
	}
}

class Minesweeper {
	rows = 16;
	columns = 16;
	mines = 40;
	mineCounter = this.mines;
	spotCounter = this.rows * this.columns - this.mines;
	error: string | undefined;
	gameState = 0;
	funcsToRunOnReset: (() => void)[];

	board: number[][];
	playBoard: (number | string | undefined)[][];

	constructor() {
		this.funcsToRunOnReset = [];
		this.board = [];
		this.playBoard = [];
		this.resetBoard();
	}

	countBombs = (row: number, column: number) => {
		let count = 0;
		if (this.board[row][column] === -1) {
			return -1;
		}

		for (let i = -1; i <= 1; i++) {
			for (let j = -1; j <= 1; j++) {
				if ((this.board[row + i] ?? [])[column + j] === -1) count++;
			}
		}
		return count;
	};

	resetBoard = (rows?: number, columns?: number, mines?: number) => {
		this.funcsToRunOnReset.forEach((fn) => fn());
		this.rows = rows ?? this.rows;
		this.columns = columns ?? this.columns;
		this.mines = mines ?? this.mines;
		this.gameState = 0;
		this.spotCounter = this.rows * this.columns - this.mines;
		this.mineCounter = this.mines;
		if (this.rows * this.columns - this.mines < 1) {
			this.error = 'INVALID BOARD';
			return;
		}
		this.error = '';
		this.board = [];
		this.playBoard = [];
		for (let i = 0; i < this.rows; i++) {
			this.board[i] = new Array(this.columns);
			this.playBoard[i] = new Array(this.columns);
		}
		const possibleValues = new Array(this.rows * this.columns).fill(0).map((_, i) => i);
		const spots = shuffle(possibleValues);
		for (let i = 0; i < this.mines; i++) {
			const spot = spots.next().value as number;
			const row = Math.floor(spot / this.columns);
			const column = spot % this.columns;
			this.board[row][column] = -1;
		}
		let row = 0;
		let column = -1;
		for (let i = 0; i < this.rows * this.columns; i++) {
			if (column == this.columns - 1) {
				row++;
				column = -1;
			}
			column++;
			this.board[row][column] = this.countBombs(row, column);
		}
	};

	revealSpot = (row: number, column: number) => {
		const val = this.board[row][column];
		if (val === -1) {
			this.playBoard[row][column] = 'dangerous';
			this.gameState = -1;
			return;
		}
		this.spotCounter--;
		if (this.spotCounter == 0) {
			this.gameState = 1;
		}

		this.playBoard[row][column] = this.board[row][column];
		if (val === 0) {
			for (let i = -1; i <= 1; i++) {
				for (let j = -1; j <= 1; j++) {
					if (row + i < 0 || row + i == this.rows) continue;
					if (column + j < 0 || column + j == this.columns) continue;
					if (this.playBoard[row + i][column + j] !== undefined) continue;
					this.revealSpot(row + i, column + j);
				}
			}
		}
		this.playBoard[row][column] = this.board[row][column];
	};

	toggleFlag = (row: number, column: number) => {
		if (this.playBoard[row][column] == undefined) {
			this.playBoard[row][column] = 'flag';
			this.mineCounter--;
			return;
		}
		if (this.playBoard[row][column] === 'flag') {
			this.playBoard[row][column] = undefined;
			this.mineCounter++;
		}
	};
}

export default Minesweeper;
