# Modal dialogue

Shows only one section, with no other navigation options, until the user finishes the immediate task

Use where the application has moved into a state from which it shouldn’t or can’t proceed without input from the user or the state of the current page needs to be preserved.

Modal instances are automatically initialised and their state can be changed programmatically using bounded functions (e.g. `$modalDialogue.open()` and `$modalDialogue.close()`)

[Preview the component](https://govuk-website-prototype.herokuapp.com/components/modal-dialogue/)

## Example usage

**HTML**
```html
<button class="govuk-button" data-toggle="modal" data-target="modal-default">Open default modal</button>
```

**Macro**
```
{{ appModalDialogue({
  id: 'modal-default',
  html: modalContentHtml
}) }}
```

**JavaScript**
```html
<script src="/public/javascripts/modal-dialogue.js"></script>
<script type="text/javascript">
  var $modalDefault = $('#modal-default');
  var modalDialogue = new GOVUK.Modules.ModalDialogue();
  modalDialogue.start($modalDefault);
</script>
```

## Accessibility acceptance criteria

The modal dialogue box must:

- receive focus on open
- inform the user that it is a dialogue
- provide a heading that says what the dialogue is about
- prevent mouse clicks outside the dialogue while open
- prevent scrolling the page while the dialogue is open
- prevent tabbing to outside the dialogue while open
- can be operable with a keyboard (allows the ESC key to close the dialogue)
- return focus to last focused element on close

## Arguments

This component accepts the following arguments.

|Name|Type|Required|Description|
|---|---|---|---|
|id|string|Yes|The unique identifier for the modal container.|
|text|string|Yes|If `html` is set, this is not required. Text to use within the modal dialogue. If `html` is provided, the `text` argument will be ignored.|
|html|string|Yes|If `text` is set, this is not required. HTML to use within the modal dialogue. If `html` is provided, the `text` argument will be ignored.|
|wide|boolean|No|Default is `false`. If set to `true` a wide version of the modal dialogue the same width as the main container will be shown.|
|classes|string|No|Classes to add to the container.|
|attributes|object|No|HTML attributes (for example data attributes) to add to the container.|

*Warning: If you’re using Nunjucks macros in production be aware that using HTML arguments, or ones ending with `.html` can be at risk from [cross-site scripting](https://en.wikipedia.org/wiki/Cross-site_scripting) attacks. More information about security vulnerabilities can be found in the [Nunjucks documentation](https://mozilla.github.io/nunjucks/api.html#user-defined-templates-warning).*
