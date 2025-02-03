/*
// Ukázkové pole studentů
const students = [
  { name: 'Charlie', score: 85 },
  { name: 'Bob', score: 95 },
  { name: 'Dave', score: 90 },
  { name: null, score: 100 },
  { name: 'Alice', score: 85 },
  { name: 'Eve' },
]

// Funkce, která seřadí studenty podle více kritérií:
// 1. Seřadí podle skóre v sestupném pořadí. (100, 99, ...)
// 2. Pokud mají dva studenti stejné skóre, seřadí podle jména v abecedním pořadí. (Adam, Bert, ...)
function sortStudents(students) {
  // Logika pro seřazení studentů
  return students
}

// Volání funkce a zobrazení výsledků
console.log(sortStudents(students))
*/
/*
const students = [
  { name: 'Charlie', score: 85 },
  { name: 'Bob', score: 95 },
  { name: 'Dave', score: 90 },
  { name: null, score: 100 },
  { name: 'Alice', score: 85 },
  { name: 'Eve' },
];

function sortStudents(students) {
  // 1. Ošetření null nebo undefined vstupu.
  if (!students) {
    return [];
  }

  // 2. Vytvoření kopie pole, aby funkce byla čistá.
  const studentsCopy = [...students];

  // 3. Seřazení studentů podle kritérií.
  studentsCopy.sort((a, b) => {
    // 3a. Ošetření chybějícího skóre. Pokud a nemá skóre, dej ho na konec, pokud b nemá skóre, dej ho na konec.
    const scoreA = a.score === undefined ? -1 : a.score;
    const scoreB = b.score === undefined ? -1 : b.score;
    

    if (scoreA < scoreB) {
      return 1; // b má větší score, tak je napřed
    }

    if (scoreA > scoreB) {
      return -1; // a má větší score, tak je napřed
    }


    // 3b. Pokud mají stejné skóre, seřadíme podle jména.
    const nameA = a.name === null ? "" : a.name;
    const nameB = b.name === null ? "" : b.name;
    
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0; // Jména jsou stejná
  });

  return studentsCopy;
}

// Volání funkce a zobrazení výsledků
console.log(sortStudents(students));
*/

const students = [
  { name: 'Charlie', score: 85 },
  { name: 'Bob', score: 95 },
  { name: 'Dave', score: 90 },
  { name: null, score: 100 },
  { name: 'Alice', score: 85 },
  { name: 'Eve' },
];

function sortStudents(students) {
  if (!Array.isArray(students)) return [];

  return students.slice().sort((a, b) => {
    // Použití nullish coalescing operatoru k nahrazení undefined/absent hodnot
    const scoreA = a.score ?? -Infinity;
    const scoreB = b.score ?? -Infinity;

    // Seřazení podle skóre (sestupně)
    if (scoreA !== scoreB) return scoreB - scoreA;

    // Seřazení podle jména (vzestupně)
    return (a.name ?? "").localeCompare(b.name ?? "");
  });
}

// Volání funkce a zobrazení výsledků
console.log(sortStudents(students));
