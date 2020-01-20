# Banner

Displays a page banner, designed to highlight important information.



[Preview the component](https://govuk-website-prototype.herokuapp.com/components/banner/)

## Example usage

```
{{ appBanner({
  heading: {
    text: 'Summary'
  },
  description: {
    text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  }
}) }}
```

## Accessibility acceptance criteria
The thumbnail image, and the link wrapping it, must not focusable or shown to screenreaders.

The banner must:

- be visually distinct from other content on the page
- have an accessible name that describes the banner as a notice
- have a text contrast ratio higher than 4.5:1 against the background colour to meet [WCAG 2.1 level AA](https://www.w3.org/TR/WCAG21/)

## Arguments

This component accepts the following arguments.

|Name|Type|Required|Description|
|---|---|---|---|




*Warning: If you’re using Nunjucks macros in production be aware that using HTML arguments, or ones ending with `.html` can be at risk from [cross-site scripting](https://en.wikipedia.org/wiki/Cross-site_scripting) attacks. More information about security vulnerabilities can be found in the [Nunjucks documentation](https://mozilla.github.io/nunjucks/api.html#user-defined-templates-warning).*
