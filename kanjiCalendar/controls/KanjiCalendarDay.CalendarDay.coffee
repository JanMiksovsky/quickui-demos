###
A calendar day showing the date in both arabic and kanji numerals.
###

class window.KanjiCalendarDay extends CalendarDay

  inherited:
    content:
      html: "div", ref: "dayContainer", content: [
        { html: "div", ref: "arabicNumber" }
        { control: "CalligraphyNumber", ref: "calligraphyNumber", class: "vertical" }
      ]

  initialize: ->
    # We could use CSS transitions for this, but then the controls would fade
    # out immediately on mouse out, instead of fading in and then fading out.
    @hover =>
      @$calligraphyNumber().animate opacity: 1.0
    , =>
      @$calligraphyNumber().animate opacity: 0.3

  content: Control.chain( "$arabicNumber", "content", ( content ) ->
    @$calligraphyNumber().number content unless @hasClass "outsideRange" 
  )