/* eslint-env jquery */
/*
  Toggle the display of elements

  Use as follows:

  <div data-module="js-toggle">
    <a href="#" data-controls="target" data-expanded="true">
      Show more
    </a>
    <div id="target">
      Content to be toggled
    </div>
  </div>

  Use `data-controls` and `data-expanded` to indicate the
  starting state and the IDs of the elements that the toggle
  controls. This is synonymous with ARIA attributes, which
  get added when starting.

  If you want to set `data-expanded` to false, you must add
  the `js-hidden` class to the element you wish to hide in
  your template, the module will not do this for you.

  `data-controls` can contain more than one element, space
  separated.

  Use `data-toggle-class` on the parent element to set the
  class that is toggled. Defaults to `js-hidden`.

  Use `data-toggled-text` on the trigger element to set the
  text shown when the element is toggled. Defaults to not
  changing.

  Use `data-track-category` and `data-track-action` together
  to enable analytics on the element. The label will be
  determined based on the text present within the element
  at the time it was clicked.
*/

window.GOVUK = window.GOVUK || {};
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  'use strict'

  Modules.Toggle = function () {
    this.start = function ($element) {
      var toggleSelector = '[data-controls][data-expanded]'
      var toggleClass = $element.attr('data-toggle-class') || 'js-hidden'
      var trackable = '[data-track-category][data-track-action]'

      $element.on('click', toggleSelector, toggle)
      $element.find(toggleSelector).each(addAriaAttrs)

      // Add the ARIA attributes with JavaScript
      // If the JS fails and there's no interactive elements, having
      // no aria attributes is an accurate representation.
      function addAriaAttrs () {
        var $toggle = $(this)
        $toggle.attr('role', 'button')
        $toggle.attr('aria-controls', $toggle.data('controls'))
        $toggle.attr('aria-expanded', $toggle.data('expanded'))

        var $targets = getTargetElements($toggle)
        $targets.attr('aria-live', 'polite')
        $targets.attr('role', 'region')
        $toggle.data('$targets', $targets)
      }

      function toggle (event) {
        var $toggle = $(event.target)
        var expanded = $toggle.attr('aria-expanded') === 'true'
        var $targets = $toggle.data('$targets')

        if (expanded) {
          $toggle.attr('aria-expanded', false)
          $targets.addClass(toggleClass)
        } else {
          $toggle.attr('aria-expanded', true)
          $targets.removeClass(toggleClass)
        }

        var toggledText = $toggle.data('toggled-text')
        if (typeof toggledText === 'string') {
          $toggle.data('toggled-text', $toggle.text())
          $toggle.text(toggledText)
        }

        event.preventDefault()
      }

      function getTargetElements ($toggle) {
        var ids = $toggle.attr('aria-controls').split(' ')
        var selector = '#' + ids.join(', #')

        return $element.find(selector)
      }

    }
  }
})(window.GOVUK.Modules)
