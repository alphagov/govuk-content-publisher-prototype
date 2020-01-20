# Document list

Displays an ordered list of links to documents including document type and when updated.

Outputs a list of links to documents, based on an array of document data. This must include:

- link text
- link href
- last updated date object
- document type

Tracking can be added to the links by supplying optional data attributes for each.

Documents are presented in an ordered list as the component expects that the ordering of the documents is relevant.

[Preview the component](https://govuk-website-prototype.herokuapp.com/components/document-list/)

## Example usage

```
{{ appDocumentList({
  items: [{
    href: '#',
    title: {
      text: 'Document 1'
    },
    metadata: {
      document_type: 'Statutory guidance'
    }
  },
  {
    href: '#',
    title: {
      text: 'Document 2'
    },
    metadata: {
      document_type: 'Statutory guidance'
    }
  },
  {
    href: '#',
    title: {
      text: 'Document 3'
    },
    metadata: {
      document_type: 'Statutory guidance'
    }
  }]
}) }}
```

## Accessibility acceptance criteria

The component must:

- inform the user how many items are in the list

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
|items|array|Yes|An array of content item objects. See [items](#items).|
|classes|string|No|Classes to add to the nav tag.|
|attributes|object|No|HTML attributes (for example data attributes) to add to the list tag.|

### Items

|Name|Type|Required|Description|
|---|---|---|---|
|href|string|Yes|The URL of the resource.|
|title|object|Yes|See [title](#title)|
|description|object|Yes|See [description](#description)|
|metadata|object|No|Metadata to display for each item, for example, date updated (`public_updated_at`).|
|classes|string|No|Classes to add to the line item (`<li>`).|
|attributes|object|No|HTML attributes (for example data attributes) to add to the line item (`<li>`).|

#### Title

|Name|Type|Required|Description|
|---|---|---|---|
|text|string|Yes|If `html` is set, this is not required. Text to use within the heading. If `html` is provided, the `text` argument will be ignored.|
|html|string|Yes|If `text` is set, this is not required. HTML to use within the heading. If `html` is provided, the `text` argument will be ignored.|
|classes|string|No|Classes to add to the list item tag.|
|attributes|object|No|HTML attributes (for example data attributes) to add to the list item tag.|

#### Description

|Name|Type|Required|Description|
|---|---|---|---|
|text|string|Yes|If `html` is set, this is not required. Text to use within the description. If `html` is provided, the `text` argument will be ignored.|
|html|string|Yes|If `text` is set, this is not required. HTML to use within the description. If `html` is provided, the `text` argument will be ignored.|
|classes|string|No|Classes to add to the description paragraph tag.|

*Warning: If you’re using Nunjucks macros in production be aware that using HTML arguments, or ones ending with `.html` can be at risk from [cross-site scripting](https://en.wikipedia.org/wiki/Cross-site_scripting) attacks. More information about security vulnerabilities can be found in the [Nunjucks documentation](https://mozilla.github.io/nunjucks/api.html#user-defined-templates-warning).*
