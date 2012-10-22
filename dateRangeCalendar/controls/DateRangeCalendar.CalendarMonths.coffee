class window.DateRangeCalendar extends CalendarMonths

  inherited:
    dayClass: CalendarDayButton

  initialize: ->
    @on "mouseenter", ".CalendarDay", ( event ) =>
      if @_nextClickSelectsEnd()
        target = $( event.target ).closest( ".CalendarDay" ).control()
        @_hoverToSelectionEnd target.date()
    @on
      dateSelected: ( event, date ) => @_dateSelected date

  # The end date/time of the selection.
  selectionEnd: Control.property.date ( date ) ->
    if not @selectionStart? or date < @selectionStart()
      @selectionStart date
      @_nextClickSelectsEnd true
    else
      @_nextClickSelectsEnd false
    @_applySelection @selectionStart(), date

  # The start date/time of the selection.
  selectionStart: Control.property.date ( date ) ->
    @selectionEnd date
    @_nextClickSelectsEnd true
    @_applySelection date, @selectionEnd()

  # Apply the "selected" class to all dates referenced by the indicated start
  # and end dates. For UI purposes, a partially selected date will be shown
  # selected.
  _applySelection: ( startDate, endDate ) ->
    if startDate? and endDate?

      # Use midnight on start date, just before midnight on end date.
      startDate = new Date startDate
      startDate.setHours 0
      startDate.setMinutes 0
      startDate.setSeconds 0
      startDate.setMilliseconds 0
      endDate = new Date endDate
      endDate.setHours 23
      endDate.setMinutes 59
      endDate.setSeconds 59

      dayInMilliseconds = 24 * 60 * 60 * 1000
      weekInMilliseconds = 7 * dayInMilliseconds
      dayAfterStart = new Date startDate.getTime() + dayInMilliseconds
      dayBeforeEnd = new Date endDate.getTime() - dayInMilliseconds
      weekAfterStart = new Date startDate.getTime() + weekInMilliseconds
      weekBeforeEnd = new Date endDate.getTime() - weekInMilliseconds
      for day in @days().segments()
        date = day.date()
        inRange = ( date >= startDate and date <= endDate )
        day.toggleClass "selected", inRange
        day.toggleClass "firstDayOfRange", inRange and date < dayAfterStart
        day.toggleClass "lastDayOfRange", inRange and date > dayBeforeEnd
        day.toggleClass "firstWeekOfRange", inRange and date < weekAfterStart
        day.toggleClass "lastWeekOfRange", inRange and date > weekBeforeEnd

  # Get/set date properties that should be preserved when recreating calendars.
  _dateProperties: ( properties ) ->
    if properties is undefined
      result = super()
      result.selectionStart = @selectionStart()
      result.selectionEnd = @selectionEnd()
      result
    else
      super properties

  _dateSelected: ( date ) ->
    if @_nextClickSelectsEnd()
      @selectionEnd date
    else
      @selectionStart date

  _nextClickSelectsEnd: Control.chain "applyClass/selectEnd"

  _hoverToSelectionEnd: ( date ) ->
    @_applySelection @selectionStart(), date