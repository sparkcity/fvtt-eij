/*
@param {String} characterName - The name of the character passed in as a string from actor-sheet.js
@param {Integer} skNum - The skill number passed in from actor-sheet.js
*/
function skillroll(characterName, skNum) {
  let dialogTemplate =
    '<h1>Spend Willpower?:</h1> <input class="skrollbox" data-dtype="Number" placeholder="0"></select>';
  let thisActor = game.actors.getName(characterName);
  console.log(thisActor);

  new Dialog({
    title: "Roll Skill",
    content: dialogTemplate,
    buttons: {
      rollSk: {
        label: "Roll Skill",
        callback: (html) => {
          let spend = 0;

          if ($(html).find("input.skrollbox")[0].value > 0) {
            spend = $(html).find("input.skrollbox")[0].value;
          }

          let newRollString = `1d6 + ${spend}`;
          let roll = new Roll(newRollString).roll();
          let result = roll.total;
          let chatTemplate = "";
          let skillDesc = "";

          switch (skNum) {
            case 1:
              skillDesc = thisActor.data.data.skills.skill1;
              break;
            case 2:
              skillDesc = thisActor.data.data.skills.skill2;
              break;
            case 3:
              skillDesc = thisActor.data.data.skills.skill3;
              break;
          }

          subtractWillpower(characterName, spend);

          if (result >= 3) {
            chatTemplate = `
              <p>Skill: ${skillDesc}</p>
              <p>Rolled: <b>${result}</b> with a spend of ${spend} willpower</p>
              <p>Skill Check: Success!</p>
              `;
          } else {
            chatTemplate = `
              <p>Skill: ${skillDesc}</p>
              <p>Rolled: <b>${result}</b> with a spend of ${spend} willpower</p>
              <p>Skill Check: Failure</p>
              `;
          }

          ChatMessage.create({
            content: chatTemplate,
            roll: roll,
            speaker: { alias: characterName },
          });
        },
      },
      close: {
        label: "Close",
      },
    },
  }).render(true);
}

/*
@param {String} characterName - The name of the character passed in as a string from actor-sheet.js
@param {Integer} obLvl - The level of the obsession.
*/
function updateScore(characterName, obLvl) {
  let thisActor = game.actors.getName(characterName);
  let messageContent = "";
  let newTally = 0;
  let newTotal = 0;

  switch (obLvl) {
    case 1:
      newTally = thisActor.data.data.scores.level1obsession + 1;
      newTotal = thisActor.data.data.scores.total + 1;
      thisActor.update({
        "data.scores.level1obsession": newTally,
        "data.scores.total": newTotal,
      });
      messageContent = `<p><b>Level 1 Obsession Complete</b></p>`;
      break;
    case 2:
      newTally = thisActor.data.data.scores.level2obsession + 1;
      newTotal = thisActor.data.data.scores.total + 2;
      thisActor.update({
        "data.scores.level2obsession": newTally,
        "data.scores.total": newTotal,
      });
      messageContent = `<p><b>Level 2 Obsession Complete</b></p>`;
      break;
    case 3:
      newTally = thisActor.data.data.scores.level3obsession + 1;
      newTotal = thisActor.data.data.scores.total + 3;
      thisActor.update({
        "data.scores.level3obsession": newTally,
        "data.scores.total": newTotal,
      });
      messageContent = `<p><b>Level 3 Obsession Complete</b></p>`;
      break;
  }

  ChatMessage.create({
    speaker: { alias: characterName },
    content: messageContent,
  });
}

/*
@param {String} characterName
@param {Number} amt
*/
function addWillpower(characterName, amt) {
  let thisActor = game.actors.getName(characterName);
  const newWillpower = thisActor.data.data.willpower + amt;
  thisActor.update({ "data.willpower": newWillpower });

   let chatTemplate = `
            <p><b>${characterName}</b> recovered ${amt} willpower</p>
            <p><b>New willpower:</b> ${newWillpower}</p>
            `;
  ChatMessage.create({
    content: chatTemplate,
    speaker: { alias: characterName },
  });
}

/*
@param {String} characterName
@param {Number} amt
*/
function subtractWillpower(characterName, amt) {
  let thisActor = game.actors.getName(characterName);
  const newWillpower = thisActor.data.data.willpower - amt;
  thisActor.update({ "data.willpower": newWillpower });
}

/*
@param {String} characterName - The name of the character passed in as a string from actor-sheet.js
@param {Integer} skNum - The skill number passed in from actor-sheet.js
*/
function subtractBid(characterName) {
  let dialogTemplate =
    '<h1>Subtract Bid?:</h1> <p> Subtract Bid from total willpower? There is no undoing this action. Only perform this action after you know that you have the winning bid.</p> <input class="bidbox" data-dtype="Number" placeholder="0"></select>';
  let thisActor = game.actors.getName(characterName);

  new Dialog({
    title: "Subtract Bid",
    content: dialogTemplate,
    buttons: {
      subBid: {
        label: "Subtract Bid",
        callback: (html) => {
          let subtractThis = 0;
          if ($(html).find("input.bidbox")[0].value > 0) {
            subtractThis = $(html).find("input.bidbox")[0].value;
          }

          subtractWillpower(characterName, subtractThis);

          let chatTemplate = `
            <p><b>Active Voice</b>: ${characterName}</p>
            <p><b>Bid Subtracted from Willpower:</b> ${subtractThis}</p>
            <p><b>New willpower:</b> ${thisActor.data.data.willpower - subtractThis}</p>
            `;
          ChatMessage.create({
            content: chatTemplate,
            speaker: { alias: characterName },
          });
        },
      },
      close: {
        label: "Close",
      },
    },
  }).render(true);
}

export { skillroll, updateScore, subtractBid, addWillpower };
