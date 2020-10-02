import { ATTRIBUTE_TYPES } from "./constants.js";
import { skillroll } from "../module/eij.js";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class SimpleActorSheet extends ActorSheet {

  /** @override */
	static get defaultOptions() {
	  return mergeObject(super.defaultOptions, {
  	  classes: ["eij", "sheet", "actor"],
  	  template: "systems/eij/templates/actor-sheet.html",
      width: 600,
      height: 600,
      tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description"}],
      dragDrop: [{dragSelector: ".item-list .item", dropSelector: null}]
    });
  }

  /* -------------------------------------------- */
  /** @override */
  getData() {
    const  data = super.getData();
    data.dtypes = ["String", "Number", "Boolean"];
    return  data;
    }

  /* -------------------------------------------- */

  /** @override */
	activateListeners(html) {
    
    super.activateListeners(html);

    //If a third skill is taken, the starting willpower is 7. Otherwise, the starting willpower is the standard 10.
    html.find('input.special').change(ev => {
      var sk3 = $(html).parents('.app').find('input.special')[0].value;
      if(sk3 === ""){
        console.log("No skill 3 detected.");
        $(html).parents('.app').find('.willpowerInput')[0].value = 10;
      }
      else{
        $(html).parents('.app').find('.willpowerInput')[0].value = 7;
      }
    });

  //Rolling for skills decreases willpower by the any amount spent
    html.find('.column .row a.rowlabel.sk1').click(ev => {
      skillroll();
    });
    html.find('.column .row a.rowlabel.sk2').click(ev => {
      skillroll();
    });
    html.find('.column .row a.rowlabel.sk3').click(ev => {
      skillroll();
    });

  }//end of activatelisteners

}