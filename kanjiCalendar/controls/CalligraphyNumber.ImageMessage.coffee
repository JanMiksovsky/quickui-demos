###
Show a number in kanji calligraphy
###

class window.CalligraphyNumber extends ImageMessage

  initialize: ->
    @imageDictionary
      "一": "/demos/kanjiCalendar/resources/calligraphy/Kanji 1.png"
      "二": "/demos/kanjiCalendar/resources/calligraphy/Kanji 2.png"
      "三": "/demos/kanjiCalendar/resources/calligraphy/Kanji 3.png"
      "四": "/demos/kanjiCalendar/resources/calligraphy/Kanji 4.png"
      "五": "/demos/kanjiCalendar/resources/calligraphy/Kanji 5.png"
      "六": "/demos/kanjiCalendar/resources/calligraphy/Kanji 6.png"
      "七": "/demos/kanjiCalendar/resources/calligraphy/Kanji 7.png"
      "八": "/demos/kanjiCalendar/resources/calligraphy/Kanji 8.png"
      "九": "/demos/kanjiCalendar/resources/calligraphy/Kanji 9.png"
      "十": "/demos/kanjiCalendar/resources/calligraphy/Kanji 10.png"

  number: Control.property.integer( ( number ) ->
    calligraphyText = CalligraphyNumber.calligraphyNumbers[ number ]
    @message calligraphyText
  )

  @calligraphyNumbers: [
    ""   # Placeholder for zero
    "一"
    "二"
    "三"
    "四"
    "五"
    "六"
    "七"
    "八"
    "九"
    "十"
    "十一"
    "十二"
    "十三"
    "十四"
    "十五"
    "十六"
    "十七"
    "十八"
    "十九"
    "二十"
    "二十一"
    "二十二"
    "二十三"
    "二十四"
    "二十五"
    "二十六"
    "二十七"
    "二十八"
    "二十九"
    "三十"
    "三十一"
  ]
