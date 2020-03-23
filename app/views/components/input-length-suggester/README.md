# Input length suggester

To suggest an input has a certain amount of characters.

[Preview the component](https://govuk-content-publisher.herokuapp.com/components/input-length-suggester/)

## Example usage

```
{{ appInputLengthSuggester({
  data: {
    for: "example-1",
    showFrom: 20,
    message: "This field should be less than 15 characters. Current characters: {count}"
  },
  aria: {
    live: "polite"
  }
}) }}
```

## Accessibility acceptance criteria

The component must:

- be hidden by default
- be visible when a specified character number is reached
- poll for changes to support screen readers


## Arguments

This component accepts the following arguments.

|Name|Type|Required|Description|
|---|---|---|---|




*Warning: If you’re using Nunjucks macros in production be aware that using HTML arguments, or ones ending with `.html` can be at risk from [cross-site scripting](https://en.wikipedia.org/wiki/Cross-site_scripting) attacks. More information about security vulnerabilities can be found in the [Nunjucks documentation](https://mozilla.github.io/nunjucks/api.html#user-defined-templates-warning).*
