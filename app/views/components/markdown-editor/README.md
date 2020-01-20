# Markdown editor

Allows editing and previewing markdown.

If JavaScript is disabled this component falls back to a textarea component without the preview functionality.

[Preview the component](https://govuk-content-publisher.herokuapp.com/components/markdown-editor/)

## Example usage

```
{{ appMarkdownEditor({
  attributes: {
    id: 'markdown-editor-default'
  },
  label: {
    for: 'markdown-editor',
    text: 'Label text',
    classes: 'govuk-!-font-weight-bold'
  },
  hint: {
    text: 'Hint text'
  },
  errorMessage: {
    text: 'Error message'
  },
  textarea: {
    id: 'markdown-editor',
    name: 'markdown-editor',
    attributes: {
      'data-paste-html-to-govspeak': false,
      spellcheck: true
    }
  },
  value: '## Lorem ispsum dolor sit emet'
}) }}
```

## Accessibility acceptance criteria

The component must:

- accept focus
- be focusable with a keyboard
- be usable with a keyboard
- be usable with touch
- indicate when it has focus
- have correctly associated labels

Links in the component must:

- accept focus
- be focusable with a keyboard
- be usable with a keyboard
- indicate when they have focus
- change in appearance when touched (in the touch-down state)
- change in appearance when hovered
- be usable with touch
- be usable with [voice commands](https://www.w3.org/WAI/perspectives/voice.html)
- have visible text

## Arguments

This component accepts the following arguments.

|Name|Type|Required|Description|
|---|---|---|---|


### Label

|Name|Type|Required|Description|
|---|---|---|---|


### Hint

|Name|Type|Required|Description|
|---|---|---|---|


### Error message

|Name|Type|Required|Description|
|---|---|---|---|



*Warning: If you’re using Nunjucks macros in production be aware that using HTML arguments, or ones ending with `.html` can be at risk from [cross-site scripting](https://en.wikipedia.org/wiki/Cross-site_scripting) attacks. More information about security vulnerabilities can be found in the [Nunjucks documentation](https://mozilla.github.io/nunjucks/api.html#user-defined-templates-warning).*
