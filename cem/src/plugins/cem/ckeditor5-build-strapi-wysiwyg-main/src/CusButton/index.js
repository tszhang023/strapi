import Plugin from '@ckeditor/ckeditor5-core/src/plugin'
import imageIcon from './icons/2-column.svg'
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview'
import Widget from '@ckeditor/ckeditor5-widget/src/widget';
import InsertCommand from './command'
import { toWidget, toWidgetEditable } from '@ckeditor/ckeditor5-widget/src/utils';

export default class MultiColumn extends Plugin {
  static get requires() {
    return [ Widget ];
  }

  init() {
    const editor = this.editor
    this._defineSchema()
    this._defineConverters();
    this.editor.commands.add( 'insertMultiColumn', new InsertCommand( editor ) );

    editor.ui.componentFactory.add('multiColumn', (locale) => {
      const view = new ButtonView(locale)

      view.set({
        label: 'Double Columns',
        icon: imageIcon,
        tooltip: true,
      })

      view.on('execute', () => {
        editor.execute( 'insertMultiColumn' );
      })

      return view
    })

    editor.execute( 'insertMultiColumn' );
  }

  _defineSchema() {
    const schema = this.editor.model.schema;

    schema.register( 'cusBtn', {
      allowWhere: '$text',
      isInline: true,
      isObject: true,
      allowAttributesOf: '$text',

      // The placeholder can have many types, like date, name, surname, etc:
      allowAttributes: [ 'name' ]
    } );
  }

  _defineConverters() {
    const conversion = this.editor.conversion;

    conversion.for( 'upcast' ).elementToElement( {
      model: 'cusBtn',
      view: {
          name: 'section',
          classes: 'multi-column'
      }
    } );

    conversion.for( 'dataDowncast' ).elementToElement( {
      model: 'cusBtn',
      view: {
          name: 'section',
          classes: 'multi-column'
      }
    } );

    conversion.for( 'editingDowncast' ).elementToElement( {
      model: 'cusBtn',
      view: ( modelElement, { writer: viewWriter } ) => {
        const section = viewWriter.createContainerElement( 'section', { class: 'multi-column' } );

        return toWidget( section, viewWriter, { label: 'multi column widget', hasSelectionHandle: true } );
      }
    } );
  }
}
