# Contextual guidance

Provides a container with additional information when focusing an input field (e.g. input, textarea).

This component is build to be used with an input field passed in as a block and must reference its ID using the `for` attribute.

On tablet and desktop, the guidance container is set to float on the page and prevent other elements from moving around (e.g. pushing next fields down the page).

[Preview the component](https://govuk-website-prototype.herokuapp.com/components/contents-list-with-body/)

## Example usage

**Macro**
```
{% call appContextualGuidance({
  id: 'contextual-guidance-01',
  for: 'subject',
  heading: {
    text: 'Writing a subject'
  },
  description: {
    text: 'The subject must make clear what the content offers users. Use the words your users do to help them find this. Avoid wordplay or teases.'
  }
}) %}

  {{ govukInput({
    id: 'subject',
    name: 'subject',
    label: {
      text: 'Subject',
      classes: 'app-label'
    },
    classes: 'app-input'
  }) }}

{% endcall %}
```

**JavaScript**
```html
<script src="/public/javascripts/contextual-guidance.js"></script>
<script type="text/javascript">
  var $element = $('#contextual-guidance-01');
  var contextualGuidance = new GOVUK.Modules.ContextualGuidance();
  contextualGuidance.start($element);
</script>
```

## Accessibility acceptance criteria

The component must:

- be hidden by default
- be visible when the associated input field if focused
- stay visible until another input field with guidance is being focused

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
|id|string|Yes|ID of the parent container.|
|for|string|Yes|For attribute for the guidance wrapper.|
|heading|object|Yes|See [heading](#heading)|
|description|object|Yes|See [description](#description)|
|classes|string|No|Classes to add to the container.|
|attributes|object|No|HTML attributes (for example data attributes) to add to the container.|

### Heading

|Name|Type|Required|Description|
|---|---|---|---|
|text|string|Yes|If `html` is set, this is not required. Text to use within the heading. If `html` is provided, the `text` argument will be ignored.|
|html|string|Yes|If `text` is set, this is not required. HTML to use within the heading. If `html` is provided, the `text` argument will be ignored.|
|headingLevel|numeric|No|A number for the heading level. Defaults to 2 (`<h2>`)|
|classes|string|No|Classes to add to the heading tag.|
|attributes|object|No|HTML attributes (for example data attributes) to add to the heading tag.|

### Description

|Name|Type|Required|Description|
|---|---|---|---|
|text|string|Yes|If `html` is set, this is not required. Text to use within the description. If `html` is provided, the `text` argument will be ignored.|
|html|string|Yes|If `text` is set, this is not required. HTML to use within the description. If `html` is provided, the `text` argument will be ignored.|
|classes|string|No|Classes to add to the description paragraph tag.|

*Warning: If you’re using Nunjucks macros in production be aware that using HTML arguments, or ones ending with `.html` can be at risk from [cross-site scripting](https://en.wikipedia.org/wiki/Cross-site_scripting) attacks. More information about security vulnerabilities can be found in the [Nunjucks documentation](https://mozilla.github.io/nunjucks/api.html#user-defined-templates-warning).*
