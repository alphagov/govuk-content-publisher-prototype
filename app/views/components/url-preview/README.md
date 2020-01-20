# URL Preview

Generates URL from an input value and validates it with a server endpoint.

This component uses a text input field to get the input value, sends the value to a server endpoint and returns the appropriate response.

[Preview the component](https://govuk-content-publisher.herokuapp.com/components/url-preview/)

## Example usage

```
{{ appUrlPreview({

}) }}
```

## Accessibility acceptance criteria

The component must:

- update its content to reflect changes in the referenced input field

## Arguments

This component accepts the following arguments.

|Name|Type|Required|Description|
|---|---|---|---|



*Warning: If you’re using Nunjucks macros in production be aware that using HTML arguments, or ones ending with `.html` can be at risk from [cross-site scripting](https://en.wikipedia.org/wiki/Cross-site_scripting) attacks. More information about security vulnerabilities can be found in the [Nunjucks documentation](https://mozilla.github.io/nunjucks/api.html#user-defined-templates-warning).*
