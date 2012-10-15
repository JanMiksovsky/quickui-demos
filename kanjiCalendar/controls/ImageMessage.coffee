###
Maps each character in a text message to a corresponding image.
###

class window.ImageMessage extends Control

  # The dictionary mapping characters to images
  imageDictionary: Control.property -> @_refresh()

  # The message to show as images
  message: Control.property -> @_refresh()

  _imageForCharacter: ( c ) ->
    src = @imageDictionary()[c]
    if src?
      $( "<img/>" ).prop "src", src

  _refresh: ->
    @content ( @_imageForCharacter c for c in @message() ? [] )