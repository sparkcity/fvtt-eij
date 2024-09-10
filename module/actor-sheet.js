import { ATTRIBUTE_TYPES } from "./constants.js";
import { skillroll, updateScore, subtractBid, addWillpower } from "./eij.js";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class EveryoneIsJohnActorSheet extends ActorSheet {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["eij", "sheet", "actor"],
      template: "systems/fvtt-eij/templates/actor-sheet.html",
      width: 600,
      height: 600,
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "description",
        },
      ],
      dragDrop: [{ dragSelector: ".item-list .item", dropSelector: null }],
    });
  }

  /* -------------------------------------------- */
  /** @override */
  getData() {
    const baseData = super.getData();
    return {
      actor: baseData.actor,
      data: baseData.system,
      dtypes: ["String", "Number", "Boolean"],
    };
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    var characterName = $(html)
      .parents(".app")
      .find(".sheet-header h1.charname input")[0].value;

    html.find(".sheet-header h1.charname input").change((ev) => {
      characterName = $(html)
        .parents(".app")
        .find(".sheet-header h1.charname input")[0].value;
    });

    //If a third skill is taken, the starting willpower is 7. Otherwise, the starting willpower is the standard 10.
    html.find("input.special").change((ev) => {
      var sk3 = $(html).parents(".app").find("input.special")[0].value;
      if (sk3 === "") {
        console.log("No skill 3 detected.");
        let thisActor = game.actors.getName(characterName);
        const newWillpower = 10;
        thisActor.update({ "system.willpower": newWillpower });
      } else {
        let thisActor = game.actors.getName(characterName);
        const newWillpower = 7;
        thisActor.update({ "system.willpower": newWillpower });
      }
    });

    //Rolling for skills decreases willpower by the any amount spent
    html.find(".column .row a.rowlabel.sk1").click((ev) => {
      skillroll(characterName, 1);
    });
    html.find(".column .row a.rowlabel.sk2").click((ev) => {
      skillroll(characterName, 2);
    });
    html.find(".column .row a.rowlabel.sk3").click((ev) => {
      skillroll(characterName, 3);
    });

    //Tallying obsessions
    html.find(".column .row a.rowlabel.ob1").click((ev) => {
      updateScore(characterName, 1);
    });
    html.find(".column .row a.rowlabel.ob2").click((ev) => {
      updateScore(characterName, 2);
    });
    html.find(".column .row a.rowlabel.ob3").click((ev) => {
      updateScore(characterName, 3);
    });

    //Subtract bid button
    html.find("button.subtractBid").click((ev) => {
      subtractBid(characterName);
    });

    // Recover willpower button
    html.find("button.addWillpower").click((ev) => {
      addWillpower(characterName, 1);
    });
  } //end of activatelisteners
}
