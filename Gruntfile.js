/**
 * Build the markdown editor app. 
 */

module.exports = function(grunt) {
	
	grunt.initConfig({
		clean: ['./assets', './tmp']
	});
	
	// Load the coffeescript compiler plug-in
	grunt.loadNpmTasks('grunt-contrib-coffee');
	
	// Shorthand "chunked" configuration to set a property called 'coffee'
	// This makes setting configuration options clearer be allowing separate
	// sections to be added as required
	grunt.config('coffee', {
		app: {
			options: {
				bare: false
			},
			files: {
				'tmp/compiled.js': ['coffeescript/app.coffee',
				                    'coffeescript/factories/*.coffee',
				                    'coffeescript/controllers/*.coffee']
			}
		}
	});
	
	// Load the concat plug-in
	grunt.loadNpmTasks('grunt-contrib-concat');

	// Configure concat scripts to concatenate angular and compiled js to a single file 
	grunt.config('concat', {
		scripts: {
			src: ['bower_components/angular/angular.js',
			      'bower_components/angular-sanitize/angular-sanitize.js',
			      'bower_components/markdown/dist/markdown.js',
			      'tmp/compiled.js'],
			dest: 'tmp/app.js'
		}
	});
	
	// Load the uglify plug-in
	grunt.loadNpmTasks('grunt-contrib-uglify');
	
	// Configure uglify to minimise the temporary app.js to assets/app.js
	grunt.config('uglify', {
		scripts: {
			files: {
				'assets/app.js': 'tmp/app.js'
			}
		}
	});
	
	// Load the SASS plug-in
	grunt.loadNpmTasks('grunt-contrib-sass');
	
	// Configure SASS compiler
	grunt.config('sass', {
		app: {
			files: {
				'tmp/app.css': ['sass/style.scss']
			}
		}
	});
	
	// Load the CSS minify plug-in
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	
	// Configure CSS minifier plug-in to take the compiled css from tmp and minify into assets
	grunt.config('cssmin', {
		app: {
			files: {
				'assets/app.css': ['tmp/app.css']
			}
		}
	});
	
	// Load the watch plugin
	grunt.loadNpmTasks('grunt-contrib-watch');
	
	// Configure watch plug-in to watch for file changes
	grunt.config('watch', {
		
		// Script changes trigger compile, concatenation and minify
		scripts: {
			files: ['coffeescript/**/*.coffee'],
			tasks: ['coffee', 'concat:scripts', 'uglify:scripts'],
			options: {
				spawn: false
			}
		},
		
		// Style changes trigger SASS compile and minify
		styles: {
			files: ['sass/**/*.scss'],
			tasks: ['sass', 'cssmin'],
			options: {
				spawn: false
			}
		},
		
		interface: {
			files: ['./index.html']
		},
		
		options: {
			livereload: true
		}
	});
	
	// Load the Javascript lint plug-in
	grunt.loadNpmTasks('grunt-contrib-jshint');
	
	// Configure the lint preprocessor. 
	// Create sets of files to be checked at different times
	grunt.config('jshint', {
		all: ['Gruntfile.js', 'assets/**/*.js'],
	    beforeconcat: ['files/before/concat/**/*.js'],
        afterconcat: ['files/after/concat/**/*.js']
	});
	
	/**
	 * Register a task to clean up the tmp and assets directories
	 */
	grunt.registerTask('clean', 'Delete the build folders and their contents', function() {
		// Use the deployDirectory config. option
		grunt.config.requires('clean');
		// Delete the deploy directory with the built in grunt.file.delete task
		var folders = grunt.config.get('clean'); 
		folders.forEach(function(file) {
			grunt.log.writeln('Deleting ' + file);
			grunt.file.delete(file);
		});
	});
	
	// Task to combine build work flow
	grunt.registerTask('default', ['clean', 'coffee', 'concat:scripts', 'sass', 'cssmin', 'uglify']);
	
};
