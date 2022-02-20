/*
Handler of chess piece element referring to the inner state of the graphic component.
 */
export default function onDragMove() {

    /*
    If the drag started, updating position and setting it to the element
    // this.x -> width coordinate
    // this.y -> height coordinate
     */
    if(this.dragging) {
        const newPosition = this.data.getLocalPosition(this.parent);
        this.x = newPosition.x;
        this.y = newPosition.y;
    }

}