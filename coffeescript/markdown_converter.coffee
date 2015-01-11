###
 * Markdown converter service
###

@MarkdownEditor.factory "MarkdownConverter", ->
	convert: (input) ->
		markdown.toHTML input

