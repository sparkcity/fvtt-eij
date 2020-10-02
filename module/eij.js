
function skillroll(){

    let dialogTemplate = '<h1>Spend Willpower?:</h1> <input class="skrollbox" data-dtype="Number" placeholder="0"></select>';
    new Dialog({
        title: "Roll Skill", 
        content: dialogTemplate,
        buttons: {
          rollSk: {
            label: "Roll Skill", 
            callback: (html) => {
            
              let spend = $(html).parents('.app').find('input.skrollbox')[0].value;
              let newRollString = `1d6 + ${spend}`
              let roll = new Roll(newRollString).roll();
              let result = roll.total;
              let chatTemplate = "";

                if(result >= 3){
                    chatTemplate = `
                    <p> Rolled: <b>${result}</b> with a spend of ${spend} willpower</p>
                    <p>Skill Check: Success!</p>
                    `;
                }
                else {
                    chatTemplate = `
                    <p> Rolled: <b>${result}</b> with a spend of ${spend} willpower</p>
                    <p>Skill Check: Failure</p>
                    `;
                }
              ChatMessage.create({
                speaker: {
                  alias: game.user.character
                },
                content: chatTemplate,
                roll: roll
              })
  
            }

          }, 
          close: {
            label: "Close"
          }
        }
      }).render(true)
}

export {skillroll};