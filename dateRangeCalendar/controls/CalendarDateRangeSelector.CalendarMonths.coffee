class window.CalendarDateRangeSelector extends CalendarMonths

  inherited:
    dayClass: CalendarDayButton

  initialize: ->
    @on "mouseenter", ".CalendarDay", ( event ) =>
      if @_nextClickSelectsEnd()
        target = $( event.target ).closest( ".CalendarDay" ).control()
        @_hoverToSelectionEnd target.date()
    @on
      dateSelected: ( event, date ) => @_dateSelected date

  selectionEnd: Control.property.date ( date ) ->
    if not @selectionStart? or date < @selectionStart()
      @selectionStart date
      @_nextClickSelectsEnd true
    else
      @_nextClickSelectsEnd false
    @_applySelection @selectionStart(), date

  selectionStart: Control.property.date ( date ) ->
    @selectionEnd date
    @_nextClickSelectsEnd true
    @_applySelection date, @selectionEnd()

  _applySelection: ( startDate, endDate ) ->
    if startDate? and endDate?
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