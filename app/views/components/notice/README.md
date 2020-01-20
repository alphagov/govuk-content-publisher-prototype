# Notice

Displays a notice to convey and highlight information.

The notice component replaces the notice and withdrawal notice patterns on GOV.UK.

[Preview the component](https://govuk-website-prototype.herokuapp.com/components/notice/)

## Example usage

```
{{ appNotice({
  description: {
    text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit'
  }
}) }}
```

## Accessibility acceptance criteria

The download icon must:

- be presentational and ignored by screen readers

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
