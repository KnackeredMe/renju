import * as readline from "readline";

enum Winner {
    DRAFT,
    BLACK,
    WHITE
}

export default class Renju {

    private rl: readline.Interface | undefined;

    private inputLines: string[] = [];

    private testCasesNum: number = 0;

    private readonly DIRECTIONS: number[][] = [[0, 1], [1, 0], [1, 1], [1, -1]];

    private readonly DIMENSIONS: number = 19;

    private readonly THRESHOLD: number = 5;

    constructor() {
        this.initReader();
    }

    private initReader(): void {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        this.rl.on("close", () => process.exit(0) );
    }

    public readInput(): void {
        if (!this.rl) return;

        this.rl.setPrompt('Enter input data:\n');
        this.rl.prompt();

        this.rl.on('line', (line: string) => {
            if (!this.testCasesNum) {
                this.testCasesNum = parseInt(line);
                return;
            }
            if (this.inputLines.length >= this.testCasesNum * this.DIMENSIONS) {
                this.processInput();
                this.rl?.close();
                return;
            }
            this.inputLines.push(line);
        });
    }

    private processInput(): void {
        for (let i = 0; i < this.testCasesNum; i++) {
            const board: number[][] = [];
            for (let j = i * this.DIMENSIONS; j < (i + 1) * this.DIMENSIONS; j++) {
                board.push(this.inputLines[j].split('').map(Number));
            }

            const result = this.checkWinner(board);
            this.printResult(result);
        }
    }

    private checkWinner(board: number[][]): string {
        for (let i = 0; i < this.DIMENSIONS; i++) {
            for (let j = 0; j < this.DIMENSIONS; j++) {
                if (board[i][j] !== 0) {
                    const color = board[i][j];
                    for (const [dx, dy] of this.DIRECTIONS) {
                        let count = 1;
                        let x = i + dx;
                        let y = j + dy;

                        //coordinates of opposite directions to check if more than 5 stones were placed in one direction
                        let xc = i + dx * -1;
                        let yc = j + dy * -1;

                        while (x >= 0 && x < this.DIMENSIONS && y >= 0 && y < this.DIMENSIONS && board[x][y] === color) {
                            count++;
                            x += dx;
                            y += dy;
                        }

                        if (count === this.THRESHOLD && board[xc][yc] !== color) {
                            return `${color}\n${i + 1} ${j + 1}`;
                        }
                    }
                }
            }
        }
        return Winner.DRAFT.toString();
    }

    private printResult(result: string): void {
        console.log(result);
    }
}
