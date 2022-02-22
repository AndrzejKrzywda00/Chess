import Game from "../Game";

// constant name of the cursor in the described state
const cursorState = "grabbing";

/*
Handler of chess piece graphic element referring to the inner state of element.
It performs tasks of:
1. Changing the cursor
2. Saving position of the element in the Game class
3. Saving data of the event to identify later which piece was dragged in multitouch scenarios.
4. Changing z index of the element (CRITICAL) to have this element of top of the component view.
- So the pieces don't go under others when dragged.
5. Updating the state of object to 'dragging'.
 */
export default function onDragStart(event) {

    this.cursor = cursorState;

    Game.startingX = this.x;
    Game.startingY = this.y;

    this.data = event.data;
    this.zIndex = 100;
    this.dragging = true;
}