/*
@param {String} characterName - The name of the character passed in as a string from actor-sheet.js
@param {Integer} skNum - The skill number passed in from actor-sheet.js
*/
function skillroll(characterName, skNum){

  let dialogTemplate = '<h1>Spend Willpower?:</h1> <input class="skrollbox" data-dtype="Number" placeholder="0"></select>';
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
            if($(html).parents('.app').find('input.skrollbox')[0].value > 0){
              spend = $(html).parents('.app').find('input.skrollbox')[0].value;
            }

            let newRollString = `1d6 + ${spend}`;
            let roll = new Roll(newRollString).roll();
            let result = roll.total;
            let chatTemplate = "";
            let skillDesc = "";

            switch(skNum){
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

            if(result >= 3){
              chatTemplate = `
              <p>Skill: ${skillDesc}</p>
              <p>Rolled: <b>${result}</b> with a spend of ${spend} willpower</p>
              <p>Skill Check: Success!</p>
              `;
            }
            else {
              chatTemplate = `
              <p>Skill: ${skillDesc}</p>
              <p>Rolled: <b>${result}</b> with a spend of ${spend} willpower</p>
              <p>Skill Check: Failure</p>
              `;            
            }

            ChatMessage.create({
              content: chatTemplate,
              roll: roll,
              speaker: {alias: characterName}
            })      
          }

        }, 
        close: {
          label: "Close"
        }
      }
    }).render(true)  

}

/*
@param {String} characterName - The name of the character passed in as a string from actor-sheet.js
@param {Integer} obLvl - The level of the obsession. Level 1 obsession = +1 pt, Level 2 = +2 pts, Level 3 = +3 pts
*/
function tallyObsession(characterName, obLvl){

}

/*
@param {String} characterName
@param {Number} amt
*/
function addWillpower(characterName, amt){
  let thisActor = game.actors.getName(characterName);
  const newWillpower = thisActor.data.data.willpower + amt;
  thisActor.update({ 'data.willpower': newWillpower });
}

/*
@param {String} characterName
@param {Number} amt
*/
function subtractWillpower(characterName, amt){
  let thisActor = game.actors.getName(characterName);
  const newWillpower = thisActor.data.data.willpower - amt;
  thisActor.update({ 'data.willpower': newWillpower });
}


export { skillroll };