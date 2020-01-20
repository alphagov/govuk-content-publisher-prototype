# Header

The header provides the crown logo, product or service name and navigation.

Requires the specification of the environment (development, integration, staging or production).

[Preview the component](https://govuk-content-publisher.herokuapp.com/components/header/)

## Example usage

```

```

## Accessibility acceptance criteria

The component must:

- have a text contrast ratio higher than 4.5:1 against the background colour to meet [WCAG 2.1 level AA](https://www.w3.org/TR/WCAG20/#visual-audio-contrast-contrast)

Links in the Header must:

- accept focus
- be focusable with a keyboard
- be usable with a keyboard
- indicate when they have focus
- change in appearance when touched (in the touch-down state)
- change in appearance when hovered
- have visible text

Images in the Header must:

- be presentational when linked to from accompanying text (crown icon).

Landmarks and Roles in the Header should:

- have a role of banner at the root of the component (``<header>``) ([ARIA 1.1](https://www.w3.org/TR/wai-aria-1.1/#banner))


## Arguments

This component accepts the following arguments.

|Name|Type|Required|Description|
|---|---|---|---|




*Warning: If you’re using Nunjucks macros in production be aware that using HTML arguments, or ones ending with `.html` can be at risk from [cross-site scripting](https://en.wikipedia.org/wiki/Cross-site_scripting) attacks. More information about security vulnerabilities can be found in the [Nunjucks documentation](https://mozilla.github.io/nunjucks/api.html#user-defined-templates-warning).*
