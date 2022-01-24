import Plugin from '@ckeditor/ckeditor5-core/src/plugin'
import imageIcon from './icons/button.svg'
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview'
import Widget from '@ckeditor/ckeditor5-widget/src/widget'
import {
  addListToDropdown,
  createDropdown,
} from '@ckeditor/ckeditor5-ui/src/dropdown/utils'
import Collection from '@ckeditor/ckeditor5-utils/src/collection'
import InsertCommand from './command'
import {
  toWidget,
  toWidgetEditable,
} from '@ckeditor/ckeditor5-widget/src/utils'
import SplitButtonView from '@ckeditor/ckeditor5-ui/src/dropdown/button/splitbuttonview'
import Model from '@ckeditor/ckeditor5-ui/src/model'

export default class MultiColumn extends Plugin {
  static get requires() {
    return [Widget]
  }

  init() {
    const editor = this.editor
    this.buttonTypes = ['primary', 'secondary', 'tertiary', 'outline']
    this.editor.commands.add('insertCusButton', new InsertCommand(editor))

    this.buttonTypes.forEach((buttonType) => {
      editor.model.schema.extend('$text', {
        allowAttributes: `btnType${buttonType}`,
      })
    })

    editor.model.schema.extend('$text', { allowAttributes: 'isButton' })

    editor.ui.componentFactory.add('cusButton', (locale) => {
      const dropdownView = createDropdown(locale, SplitButtonView)

      dropdownView.buttonView.set({
        label: 'Add button',
        icon: imageIcon,
        tooltip: true,
      })

      const items = new Collection()

      this.buttonTypes.forEach((btnType) => {
        items.add(
          new Model({
            type: 'button',
            model: new Model({
              withText: true,
              label: btnType,
            }),
          })
        )
      })

      addListToDropdown(dropdownView, items)

      dropdownView.buttonView.on('execute', (evt) => {
        editor.execute('link', 'https://', {
          isButton: true,
        })
      })

      dropdownView.on('execute', (evt) => {
        const attribute = { isButton: true }
        attribute[`btnType${evt.source.label}`] = true
        editor.execute('link', 'https://', attribute)
      })

      return dropdownView
    })

    editor.conversion.for('downcast').add((dispatcher) => {
      dispatcher.on(
        'attribute:linkHref',
        (evt, data, conversionApi) => {
          const viewWriter = conversionApi.writer
          const viewSelection = viewWriter.document.selection
          console.log(data.item.getAttribute('isButton'))

          if (!data.item.getAttribute('isButton')) {
            return
          }

          const checkType = () => {
            for (const i in this.buttonTypes) {
              if (data.item.getAttribute(`btnType${this.buttonTypes[i]}`)) {
                return this.buttonTypes[i]
              }
            }

            return this.buttonTypes[0]
          }

          const viewElement = viewWriter.createAttributeElement(
            'a',
            {
              class: `cem-button btn-${checkType()}`,
            },
            {
              priority: 5,
            }
          )

          // viewWriter.setAttribute(`btnType${checkType()}`, true, viewElement)

          if (data.item.is('selection')) {
            viewWriter.wrap(viewSelection.getFirstRange(), viewElement)
          } else {
            viewWriter.wrap(
              conversionApi.mapper.toViewRange(data.range),
              viewElement
            )
          }
        },
        { priority: 'low' }
      )
    })

    editor.conversion.for('upcast').attributeToAttribute({
      view: {
        name: 'a',
        key: 'class',
        value: 'cem-button',
      },
      model: {
        key: 'isButton',
        value: true,
      },
    })

    this.buttonTypes.map((type) => {
      editor.conversion.for('upcast').attributeToAttribute({
        view: {
          name: 'a',
          key: 'class',
          value: `btn-${type}`,
        },
        model: {
          key: `btnType${type}`,
          value: true,
        },
      })
    })
  }
}
