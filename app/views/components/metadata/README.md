# Metadata

To display relevant metadata about a document.

[Preview the component](https://govuk-content-publisher.herokuapp.com/components/metadata/)

## Example usage

```
{{ appMetadata({
  items: [
    {
      title: {
        text: "Status"
      },
      description: {
        text: "Saved as draft"
      }
    },
    {
      title: {
        text: "Last updated"
      },
      description: {
        text: "12:58pm on 17 August 2018"
      }
    },
    {
      title: {
        text: "Created"
      },
      description: {
        text: "11:02pm on 10 August 2018"
      }
    },
    {
      title: {
        text: "First published on GOV.UK"
      },
      description: {
        text: "12:00pm on 10 August 2018"
      }
    }
  ]
}) }}
```

## Accessibility acceptance criteria

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
