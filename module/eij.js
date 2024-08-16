/*
@param {String} characterName - The name of the character passed in as a string from actor-sheet.js
@param {Integer} skNum - The skill number passed in from actor-sheet.js
*/
function skillroll(characterName, skNum) {
  let dialogTemplate =
    '<h1>Spend Willpower?:</h1> <input class="skrollbox" data-dtype="Number" placeholder="0">';
  let thisActor = game.actors.getName(characterName);

  new Dialog({
    title: "Roll Skill",
    content: dialogTemplate,
    buttons: {
      rollSk: {
        label: "Roll Skill",
        callback: async (html) => {
          let spend = 0;

          if ($(html).find("input.skrollbox")[0].value > 0) {
            spend = $(html).find("input.skrollbox")[0].value;
          }

          let newRollString = `1d6 + ${spend}`;
          let roll = new Roll(newRollString);
          await roll.evaluate();
          let result = roll.total;
          let chatTemplate = "";
          let skillDesc = "";

          switch (skNum) {
            case 1:
              skillDesc = thisActor.system.skills.skill1;
              break;
            case 2:
              skillDesc = thisActor.system.skills.skill2;
              break;
            case 3:
              skillDesc = thisActor.system.skills.skill3;
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
      newTally = thisActor.system.scores.level1obsession + 1;
      newTotal = thisActor.system.scores.total + 1;
      thisActor.update({
        "system.scores.level1obsession": newTally,
        "system.scores.total": newTotal,
      });
      messageContent = `<p><b>Level 1 Obsession Complete</b></p>`;
      break;
    case 2:
      newTally = thisActor.system.scores.level2obsession + 1;
      newTotal = thisActor.system.scores.total + 2;
      thisActor.update({
        "system.scores.level2obsession": newTally,
        "system.scores.total": newTotal,
      });
      messageContent = `<p><b>Level 2 Obsession Complete</b></p>`;
      break;
    case 3:
      newTally = thisActor.system.scores.level3obsession + 1;
      newTotal = thisActor.system.scores.total + 3;
      thisActor.update({
        "system.scores.level3obsession": newTally,
        "system.scores.total": newTotal,
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
  const newWillpower = thisActor.system.willpower + amt;
  thisActor.update({ "system.willpower": newWillpower });

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
  const newWillpower = thisActor.system.willpower - amt;
  thisActor.update({ "system.willpower": newWillpower });
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
            <p><b>New willpower:</b> ${
              thisActor.system.willpower - subtractThis
            }</p>
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
