# Attachment

Displays a link to download an attachment and metadata about the file.

This component shows a link to a document that is attached to GOV.UK content along with a thumbnail and relevant file data.

It is intended to be rendered in GovSpeak and as an attachment ‘preview’ in Content Publisher.

It is not as rich in features as the attachment rendering provided by Whitehall, it lacks support for multiple languages, CSV previews and publication fields

[Preview the component](https://govuk-content-publisher-prototype.herokuapp.com/components/attachment/)

## Example usage

```
{{ appAttachment({
  heading: {
    text: 'Attachment one: guidance note'
  },
  href: 'https://assets.publishing.service.gov.uk/uploads/file/123456/attachment-one.pdf',
  metadata: {
    filename: 'attachment-one.pdf',
    fileSize: 123456,
    contentType: 'application/pdf',
    pageCount: 10,
    thumbnail: 'document'
  }
}) }}
```

## Accessibility acceptance criteria
The thumbnail image, and the link wrapping it, must not focusable or shown to screenreaders.

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
|href|string|Yes|The URL of the attached file.|
|heading|object|Yes|See [heading](#heading)|
|metadata|object|Yes|See [metadata](#metadata)|
|classes|string|No|Classes to add to the section container.|
|attributes|object|No|HTML attributes (for example data attributes) to add to the section container.|

### Heading

|Name|Type|Required|Description|
|---|---|---|---|
|text|string|Yes|If `html` is set, this is not required. Text to use within the heading. If `html` is provided, the `text` argument will be ignored.|
|html|string|Yes|If `text` is set, this is not required. HTML to use within the heading. If `html` is provided, the `text` argument will be ignored.|
|headingLevel|numeric|No|A number for the heading level. Defaults to 2 (`<h2>`)|
|classes|string|No|Classes to add to the heading tag.|
|attributes|object|No|HTML attributes (for example data attributes) to add to the heading tag.|

### Metadata

|Name|Type|Required|Description|
|---|---|---|---|
|thumbnail|string|No|The image to be displayed next to the attachment text.|
|contentType|string|No|The type of attachment, for example, Portable Document Format (PDF) and spreadsheet (XLS).|
|filename|String|No|The name of the attached file.|
|fileSize|numeric|No|The size of the attached file in bytes.|
|pageCount|numeric|No|The number of pages in the document. Only use when attaching documents, not spreadsheets or other data formats.|
|isOpenDocument|boolean|No|Used to display a link to guidance on using Open Document Formats (ODF) in your organisation.|
|alternativeFormatContactEmail|string|No|Used to display a contact email address.|

*Warning: If you’re using Nunjucks macros in production be aware that using HTML arguments, or ones ending with `.html` can be at risk from [cross-site scripting](https://en.wikipedia.org/wiki/Cross-site_scripting) attacks. More information about security vulnerabilities can be found in the [Nunjucks documentation](https://mozilla.github.io/nunjucks/api.html#user-defined-templates-warning).*
