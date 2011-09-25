﻿// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████                       ██████              ██          ██                    
//  ██                           ██  ██              ██          ██                    
//  ██     █████ ████ █████      ██  ██ █████ █████ █████ █████ █████ ████ █████ █████ 
//  ██     ██ ██ ██   ██ ██      █████  ██ ██ ██ ██  ██   ██     ██   ██      ██ ██ ██ 
//  ██     ██ ██ ██   █████      ██  ██ ██ ██ ██ ██  ██   █████  ██   ██   █████ ██ ██ 
//  ██     ██ ██ ██   ██         ██  ██ ██ ██ ██ ██  ██      ██  ██   ██   ██ ██ ██ ██ 
//  ██████ █████ ██   █████      ██████ █████ █████  ████ █████  ████ ██   █████ █████ 
//                                                                               ██    
//                                                                               ██    
//
// ------------------------------------------------------------------------------------------------------------------------
// Core Bootstrap - Sets up the framework, then loads core classes and modules

	try
	{
		//--------------------------------------------------------------------------------
		// initialize
		
			// reset loading flag
				xjsfl.loading = false;

			/**
			 * Pre-initialization of the environment, extractinging key variables / functions to supplied scope
			 * @param	scope		{Object}	The scope into which the framework should be extracted
			 * @param	scopeName	{String}	An optional scopeName, which when supplied, traces a short message to the Output panel 
			 * @returns		
			 */
			xjsfl.initVars = function(scope, scopeName)
			{
				// initialize only if scriptDir method is not yet defined
					if(typeof scope.scriptDir === 'undefined')
					{
						// debug
							if(scopeName)
							{
								fl.trace('> xjsfl: initializing [' +scopeName+ ']');
							}
							
						// placeholder variable for trace
							xjsfl.trace = null;
							
						// temp output object, needed before libraries are loaded
							if( ! xjsfl.settings )
							{
								xjsfl.output =
								{
									trace:function(message, newLine)
									{
										if(newLine)
										{
											trace('');
											message = message.toUpperCase();
										}
										fl.trace('> xjsfl: ' + message);
									},
									error: function(message){ fl.trace('> xjsfl: error "' + message + '"') }
								}
							}
	
						// functions
							scope.trace		= function(){fl.outputPanel.trace(Array.slice.call(this, arguments).join(', '))};
							scope.clear		= fl.outputPanel.clear;
							
						// dom getter
							scope.__defineGetter__( 'dom', function(){ return fl.getDocumentDOM(); } );
							
						// script dir getter (can't use until after main xjsfl class has loaded!)
							scope.__defineGetter__
							(
								'scriptDir',
								function()
								{
									var stack = xjsfl.utils.getStack();
									return xjsfl.file.makeURI(stack[3].path);
								}
							);
							
						// methods
							xjsfl.trace = xjsfl.output.trace;
					}
			}
	
			// initialize
				xjsfl.initVars(this, 'window');
		
		//--------------------------------------------------------------------------------
		// load

			// flags
				xjsfl.loading = true;

			// reset file debugging
				xjsfl.file.debug = false;

			// core
				xjsfl.trace('loading xJSFL...', true);
				fl.runScript(xjsfl.uri + 'core/jsfl/libraries/xjsfl.jsfl');
				
			// reset file debugging
				xjsfl.file.debug = false;

			// load key libraries
				xjsfl.trace('loading core libraries...');
				xjsfl.classes.load(['filesystem', 'template', 'class', 'output']);
				
			// load other libraries
				xjsfl.classes.loadFolder('core/jsfl/libraries/');

			// modules			
				xjsfl.trace('loading Modules...', true);
				xjsfl.modules.loadFolder();
				
			// user bootstrap
				xjsfl.trace('loading user bootstrap...', true);
				xjsfl.file.load('user/jsfl/bootstrap.jsfl');
				
			// load user libraries
				xjsfl.trace('loading user libraries...');
				xjsfl.classes.loadFolder('user/jsfl/libraries/');

			// flags
				xjsfl.loading = false;
	}
	catch(err)
	{
		xjsfl.output.trace('Error running core bootstrap');
		fl.runScript(xjsfl.uri + 'core/jsfl/libraries/output.jsfl');
		xjsfl.output.debug(err);
	}
