import Command from '@ckeditor/ckeditor5-core/src/command'

export default class InsertCommand extends Command {
  execute() {
    this.editor.model.change((writer) => {
      const element = createElement(writer)
      this.editor.model.insertContent(element)
    })
  }

  refresh() {
    const model = this.editor.model
    const selection = model.document.selection
    const allowedIn = model.schema.findAllowedParent(
      selection.getFirstPosition(),
      'cusBtn'
    )
    this.isEnabled = allowedIn !== null
  }
}

function createElement(writer) {
  const element = writer.createText('Button', {
    linkHref: 'https://',
  })

  return element
}
