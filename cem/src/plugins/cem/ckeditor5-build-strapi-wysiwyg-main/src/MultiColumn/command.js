import Command from '@ckeditor/ckeditor5-core/src/command';

export default class InsertCommand extends Command {
    execute() {
        this.editor.model.change( writer => {
            this.editor.model.insertContent( createSimpleBox( writer ) );
        } );
    }

    refresh() {
        const model = this.editor.model;
        const selection = model.document.selection;
        const allowedIn = model.schema.findAllowedParent( selection.getFirstPosition(), 'multiColumn' );

        this.isEnabled = allowedIn !== null;
    }
}

function createSimpleBox( writer ) {
    const multiColumn = writer.createElement( 'multiColumn' );
    const multiColumnLeft = writer.createElement( 'multiColumnLeft' );
    const multiColumnRight = writer.createElement( 'multiColumnRight' );

    writer.append( multiColumnLeft, multiColumn );
    writer.append( multiColumnRight, multiColumn );

    writer.appendElement( 'paragraph', multiColumnLeft );
    writer.appendElement( 'paragraph', multiColumnRight );

    return multiColumn;
}