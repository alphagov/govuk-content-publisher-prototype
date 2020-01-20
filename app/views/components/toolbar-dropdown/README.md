# Toolbar dropdown

Toggles a contextual overlay for displaying lists of buttons.

Use this component to group a series of actions.

[Preview the component](https://govuk-content-publisher.herokuapp.com/components/toolbar-dropdown/)

## Example usage

```
{{ appToolbarDropdown({
  title: {
    text: "Insert"
  },
  items: [
    {
      text: "Image",
      href: "#",
      target: "_blank",
      attributes: {
        "data-module": "inline-image-modal",
        "data-modal-action": "open"
      }
    },
    {
      element: "button",
      text: "Contact",
      type: "submit",
      name: "submit"
    }
  ],
  attributes: {
    "id": "example-1",
    "data-module": "toolbar-dropdown"
  }
}) }}
```

## Accessibility acceptance criteria

The component must:

- be operable with a keyboard
- toggle the contextual overlay when clicked
- hide the contextual overlay on blur
- hide the contextual overlay when a button element within the component is being clicked

## Arguments

This component accepts the following arguments.

|Name|Type|Required|Description|
|---|---|---|---|



*Warning: If you’re using Nunjucks macros in production be aware that using HTML arguments, or ones ending with `.html` can be at risk from [cross-site scripting](https://en.wikipedia.org/wiki/Cross-site_scripting) attacks. More information about security vulnerabilities can be found in the [Nunjucks documentation](https://mozilla.github.io/nunjucks/api.html#user-defined-templates-warning).*
