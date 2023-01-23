import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";

const DATA_FILE_NAME_EXAMPLE = "data-example.txt";
const DATA_FILE_NAME = "data.txt";

type Move = {
  x: number;
  y: number;
};

type Position = {
  x: number;
  y: number;
};

main();

function main(): void {
  console.log("Part One Example:", partOne(DATA_FILE_NAME_EXAMPLE));
  console.log("Part One        :", partOne(DATA_FILE_NAME));
  // console.log("Part Two Example:", partTwo(DATA_FILE_NAME_EXAMPLE));
  // console.log("Part Two        :", partTwo(DATA_FILE_NAME));
}

function partOne(filename: string): number {
  const moves = parseFileToMoves(Deno.readTextFileSync(filename));

  const headPosition = { x: 0, y: 0 };
  let tailPosition = structuredClone(headPosition);
  const tailPositions = new Set<string>();

  moves.forEach((move) => {
    headPosition.x += move.x;
    headPosition.y += move.y;

    tailPosition = calculateHeadPosition(headPosition, tailPosition);
    tailPositions.add(JSON.stringify(tailPosition));
  });

  return tailPositions.size;
}

// For debugging
function _logBoard(head: Position, tail: Position): void {
  const board = [
    ["x", "x", "x", "x", "x", "x"],
    ["x", "x", "x", "x", "x", "x"],
    ["x", "x", "x", "x", "x", "x"],
    ["x", "x", "x", "x", "x", "x"],
    ["x", "x", "x", "x", "x", "x"],
    ["x", "x", "x", "x", "x", "x"],
  ];

  board[head.y][head.x] = "H";
  board[tail.y][tail.x] = "T";

  board.reverse();
}

function calculateHeadPosition(
  headPosition: Position,
  tailPosition: Position
): Position {
  const dx = headPosition.x - tailPosition.x;
  const dy = headPosition.y - tailPosition.y;
  let newTailPosition = {
    x: tailPosition.x,
    y: tailPosition.y,
  };

  if (Math.abs(dx) === 2 && Math.abs(dy) === 1) {
    newTailPosition = {
      x: newTailPosition.x + Math.sign(dx) * 1,
      y: newTailPosition.y + Math.sign(dy) * 1,
    };
  } else if (Math.abs(dy) === 2 && Math.abs(dx) === 1) {
    newTailPosition = {
      x: newTailPosition.x + Math.sign(dx) * 1,
      y: newTailPosition.y + Math.sign(dy) * 1,
    };
  } else if (Math.abs(dx) === 2) {
    newTailPosition = {
      x: newTailPosition.x + Math.sign(dx) * 1,
      y: newTailPosition.y,
    };
  } else if (Math.abs(dy) === 2) {
    newTailPosition = {
      x: newTailPosition.x,
      y: newTailPosition.y + Math.sign(dy) * 1,
    };
  }

  return newTailPosition;
}

function parseFileToMoves(fileString: string): Move[] {
  return fileString
    .split("\n")
    .flatMap((x) => {
      const [direction, count] = x.split(" ");
      return new Array(Number(count)).fill(direction);
    })
    .map((direction: "U" | "D" | "L" | "R") => {
      const directions = {
        R: { x: 1, y: 0 },
        L: { x: -1, y: 0 },
        U: { x: 0, y: 1 },
        D: { x: 0, y: -1 },
      };

      return directions[direction];
    });
}

// function partTwo(filename: string): {};

Deno.test(function shouldPassPartOneExample() {
  assertEquals(partOne(DATA_FILE_NAME_EXAMPLE), 13);
});

Deno.test(function shouldPassPartOne() {
  assertEquals(partOne(DATA_FILE_NAME), 6023);
});

// Deno.test(function shouldPassPartTwoExample() {
//   assertEquals(partTwo(DATA_FILE_NAME_EXAMPLE), 8);
// });

// Deno.test(function shouldPassPartTwo() {
//   assertEquals(partTwo(DATA_FILE_NAME), 211680);
// });