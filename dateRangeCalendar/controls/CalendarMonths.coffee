class window.CalendarMonths extends Repeater

  className: "CalendarMonths"
  inherited:
    count: 2
    generic: true
    repeatClass: CalendarMonthWithHeadings

  count: ( count ) ->
    if count isnt undefined
      saveDateProperties = @_dateProperties()
      saveCulture = @culture()
      saveDayClass = @dayClass()
    result = super count
    if count isnt undefined
      @dayClass saveDayClass
      @culture saveCulture
      @_dateProperties saveDateProperties
    result

  # The control's current culture.
  culture: ( culture ) ->
    if culture isnt undefined
      saveDateProperties = @_dateProperties()
    result = super culture
    if culture isnt undefined
      @controls().culture culture
      @_dateProperties saveDateProperties
    result

  dayClass: Control.chain "months", "dayClass"

  days: ->
    results = $()
    for month in @months().segments()
      days = month.days()
      results = results.add days
    results.control()

  # The date of the first calendar, updating the other calendars to follow.
  # TODO: If the date is already visible in one of the months, it is selected in
  # that calendar. If the date falls after the last visible month, the selected
  # date is shown in the last calendar. If the date comes before the first
  # visible calendar, the selected date is shown in the first calendar. In
  # either of those two cases, the other calendars are adjusted to show the
  # months before/after the one with the selected date.
  date: ( date ) ->
    if date is undefined
      firstOfMonth = new Date @months().date()
      firstOfMonth.setDate 1
      firstOfMonth
    else
      firstOfMonth = new Date date
      firstOfMonth.setDate 1
      for calendar in @months().segments()
        calendar.date new Date firstOfMonth
        # Increment the month. This should automatically wrap to January.
        firstOfMonth.setMonth firstOfMonth.getMonth() + 1
      @

  initialize: ->
    # By default, show the current date in the first calendar.
    # TODO: Only do this if the date hasn't already been explicitly set.
    @date CalendarDay.today()

  months: Control.chain "children", "control"

  # Get/set date properties that should be preserved when recreating calendars.
  _dateProperties: ( properties ) ->
    if properties is undefined
      return date: @date()
    else
      @properties properties

  _refresh: ->
    d = @date()
    super()
    @date d
    @