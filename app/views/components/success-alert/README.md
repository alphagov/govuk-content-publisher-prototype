# Notice

Used at the top of the page, to summarise a successful user action.

[Preview the component](https://govuk-content-publisher.herokuapp.com/components/success-alert/)

## Example usage

```
{{ appSuccessAlert({
  
}) }}
```

## Accessibility acceptance criteria

- should be focused on page load, to ensure the message is noticed by assistive tech
- should have a role of ‘alert’ to communicate that is a important and time sensitive message

## Arguments

This component accepts the following arguments.

|Name|Type|Required|Description|
|---|---|---|---|




*Warning: If you’re using Nunjucks macros in production be aware that using HTML arguments, or ones ending with `.html` can be at risk from [cross-site scripting](https://en.wikipedia.org/wiki/Cross-site_scripting) attacks. More information about security vulnerabilities can be found in the [Nunjucks documentation](https://mozilla.github.io/nunjucks/api.html#user-defined-templates-warning).*
