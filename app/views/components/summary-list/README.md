# Summary list

Use the summary list to summarise information, for example, a user’s responses at the end of a form.

[Preview the component](https://govuk-content-publisher.herokuapp.com/components/summary-list/)

## Example usage

```
{{ appSummaryList({

}) }}
```

## GOV.UK Design System

This component incorporates components from the [GOV.UK Design System](https://design-system.service.gov.uk/):

- [Summary-list](https://design-system.service.gov.uk/components/summary-list)

## Accessibility acceptance criteria

Action links in the component must:

- indicate what the action refers to (e.g. Change *name*)

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




*Warning: If you’re using Nunjucks macros in production be aware that using HTML arguments, or ones ending with `.html` can be at risk from [cross-site scripting](https://en.wikipedia.org/wiki/Cross-site_scripting) attacks. More information about security vulnerabilities can be found in the [Nunjucks documentation](https://mozilla.github.io/nunjucks/api.html#user-defined-templates-warning).*
