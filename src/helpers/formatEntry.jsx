export const formatBackEnd = (day, num, pattern, user_id, team_id) => {
  let outerArray = [];
  for (let i = 0; i < pattern.length; i++) {
    const innerArray = [];
    for (let j = 0; j < pattern[i].length; j++) {
      if (pattern[i][j] === "\ud83d") {
        if (pattern[i][j + 1] === "\udfe8") {
          innerArray.push("y");
          j++;
        } else if (pattern[i][j + 1] === "\udfe9") {
          innerArray.push("g");
          j++;
        }
      } else {
        innerArray.push("b");
      }
    }
    outerArray.push(innerArray);
  }
  outerArray = outerArray.join("").replace(/,/g, "");
  const formattedObject = {
    guess_pattern: outerArray,
    game_day: day,
    num_of_guesses: num,
    user_id,
    team_id,
  };
  return formattedObject;
};

export const formatFrontEnd = (data) => {
  const green = "🟩";
  const black = "⬛";
  const yellow = "🟨";
  const newArray = data.split("");
  let formattedArray = [];
  let str = "";
  for (let i = 0; i < newArray.length; i++) {
    if (data[i] === "b") {
      str += black;
    } else if (data[i] === "y") {
      str += yellow;
    } else {
      str += green;
    }
    if (i === 4 || i === 9 || i === 14 || i === 19 || i === 24 || i === 29) {
      formattedArray.push(str);
      str = "";
    }
  }
  console.log(formattedArray);
  return formattedArray;
};
