/**
 * @require 'lib/basic.js'
 * @require 'lib/pilyfills/es5.basic.js'
 * @require 'lib/types/types.Array.js'
 */
(function (window, oNS) {
	//var fGetNs = window.getNameSpace;
	var oBasic = oNS.Basic;
	var fExtend = oBasic.Extend;
	var typeOf = oBasic.typeOf;
	var oArrays = oNS.Types.Array;
	var oArrPttp = Array.prototype;
	var isArray = oArrays.isArray;
	var Callbacks = oBasic.getConstructor((function () {
		/**
		 * Набор опций по-цмолчанию
		 * @memberof Callbacks#
		 */
		var oDefOpts = {
			Types: null,
			Expandable: false,
			Memory: false, //для всех типов
			Once: false //для всех типов
		};
		/**
		 * Регистрирует новый тип обработчиков
		 * @param {string} typeName имя типа
		 * @param {object} [oTpOpts] опции для типа
		 */
		var registerType = function (typeName, oTpOpts) {
			var oTypes = this._Types;
			var oOpts = this._Opts;
			var oCurType, mTypeHistory;
			if (!typeOf(typeName, 'string') || typeName in oTypes) {
				return;
			}
			oTypes[typeName] = oCurType = {
				Handlers: null,
				handlerParams: null,
				Once: oTpOpts && oTpOpts.once === true
			};
			mTypeHistory = oTpOpts && oTpOpts.memory || oOpts.Memory;
			if (mTypeHistory) {
				oCurType.History = [];
				if (typeOf(mTypeHistory, 'number')) {
					oCurType.History.maxLength = mTypeHistory;
				}
			}
		};
		/**
		 * Добаляет типу новый обработчик
		 * @param {object} oType объект типа
		 * @param {function} fHandler функция-обработчик
		 * @param {boolean} [bOnce] флаг, указывающий, чот обработчик должен исполниться лишь однажды
		 */
		var addHandler = function (oType, fHandler, bOnce) {
			var aHndlrs = oType.Handlers;
			var aHndlrParams = oType.handlerParams;
			if (aHndlrs.indexOf(fHandler) > -1) {
				return;
			}
			aHndlrs.push(fHandler);
			aHndlrParams.push({
				once: bOnce === true
			});
		};
		/**
		 * Удаляет обработчик из списка
		 * @param {object} oType объект типа
		 * @param {function|number} mHandler функция-обработчик, которую необходимо удалить или ее индекс
		 */
		var removeHandler = function (oType, mHandler) {
			var aHndlrs = oType.Handlers;
			var aHndlrParams = oType.handlerParams;
			var hndlrIdx = typeOf(mHandler, 'function') ? aHndlrs.indexOf(mHandler) : typeOf(mHandler, 'number') ? mHandler : -1;
			if (hndlrIdx > -1) {
				aHndlrs.splice(hndlrIdx, 1);
				aHndlrParams.splice(hndlrIdx, 1);
			}
		};
		/**
		 * 
		 */
//			var fireOneHandler = function (fHandler, oCntxt, aArgs) {
//				fHandler.apply(oCntxt, aArgs);
//			};
//			var fireType = function (oType, oContext, aArgs) {
//				//перебор
//			};
		/**
		 * Выполняет обработчик для списка истории вызовов типа
		 * @param {object} oType объект типа
		 * @param {function} обработчик
		 */
		var fireWithTypeHistory = function (oType, fHandler) {
			var aTypeHistory = oType.History;
			var oHistoryRecord, oContext, oArgs;
			for (var recordNo = 0; recordNo < aTypeHistory.length; recordNo++) {
				oHistoryRecord = aTypeHistory[recordNo];
				oContext = oHistoryRecord.context;
				oArgs = oHistoryRecord.args;
				fHandler.apply(oContext, oArgs);
			}
		};
		/**
		 * Добавляет или удаляет однин обработчик к определенному типу
		 * @param {boolean} bAdd флаг, определяющий добавлять или удалять обработчик
		 * @param {function|object} mHandler обработчик в виде функции или объекта с параметрами
		 * @param {function} [mHandlers.handler] функция-обработчик
		 * @param {boolean} [mHandlers.once] флаг, указывающий что обработчик должен быть вызван только один раз
		 * @param {object} oType объект типа
		 * @param {boolean} bHasHistory флаг, указывающий на наличие истории вызовов типа
		 */
		var processOneHandler = function (bAdd, mHandler, oType, bHasHistory) {
			var oOpts = this._Opts;
			var bFiresOnce = (oOpts.Once || oType.once) === true;
			var bFired = oType.fired;
			var fHandler, bOnce;
			if (typeOf(mHandler, 'function')) {
				fHandler = mHandler;
			} else if (typeOf(mHandler, 'object')) {
				if (!typeOf(fHandler = mHandler.handler)) {
					fHandler = null;
				}
				bOnce = mHandler.once === true;
			}
			if (fHandler) {
				if (bAdd) {
					if (bHasHistory) {
						fireWithTypeHistory.call(this, oType, fHandler);
					}
					//Добавляем только если есьт возможность выполнить в будующем
					if (!(bFired && (bFiresOnce || bOnce && bHasHistory))) {
						addHandler.call(this, oType, fHandler, bOnce);
					}
				} else {
					removeHandler.call(this, oType, fHandler);
				}
			}
		};
		/**
		 * Добавление или удаление обработчика или их набора к определенному типу
		 * @param {boolean} bAdd флаг, определяющий добавлять или удалять обработчик
		 * @param {string} typeName идентификатор типа
		 * @param {function|object|array} mHandlers обработчик, или их набор, в виде функий либо объектов с функциями и параметрами
		 * @param {function} [mHandlers.handler] функция-обработчик
		 * @param {boolean} [mHandlers.once] флаг, указывающий что обработчик должен быть вызван только один раз
		 */
		var toggleHandlers = function (bAdd, typeName, mHandlers) {
			var oTypes = this._Types;
			var oCurType, bHasHistory;
			if (!(oTypes && typeName && typeOf(oCurType = oTypes[typeName], 'object'))) {
				return;
			}
			if (!isArray(oCurType.Handlers)) {
				if (bAdd) {
					oCurType.Handlers = [];
					oCurType.handlerParams = [];
				} else {
					return;
				}
			}
			bHasHistory = isArray(oCurType.History) && oCurType.History.length > 0;
			if (isArray(mHandlers)) {
				for (var hndlrNo = 0; hndlrNo < mHandlers.length; hndlrNo++) {
					processOneHandler.call(this, bAdd, mHandlers[hndlrNo], oCurType, bHasHistory);
				}
			} else {
				processOneHandler.call(this, bAdd, mHandlers, oCurType, bHasHistory);
			}
		};
		function processHandlers(bAdd, sType, mHandlers) {
			var aTypes = sType.split(' ');
			for (var typeNo = aTypes.length; typeNo--;) {
				toggleHandlers.call(this, bAdd, aTypes[typeNo], mHandlers);
			}
		}
		var fToggle = function (/*[typeName, mHndlrs] || [oHndlrs]*/) {
			var oArgs = arguments;
			var bAdd = oArrPttp.shift.apply(oArgs);
			var mFrstArg = oArgs[0];
			var frstType = typeOf(mFrstArg);
			var oHndlrs;
			if (frstType == 'string') {
				processHandlers.call(this, bAdd, mFrstArg, oArgs[1]);
			} else if (frstType == 'object') {
				oHndlrs = mFrstArg;
				for (var typeName in oHndlrs) {
					if (oHndlrs.hasOwnProperty(typeName)) {
						processHandlers.call(this, bAdd, typeName, oHndlrs[typeName]);
					}
				}
			}
		};
		/**
		 * Получает набор типов и их параметров из входных опций
		 * @param {array|object} массив идентификаторов типов или объект с соответствием тип - параметры
		 */
		var getTypes = function (mTypes) {
			var curTpName, mCurType, mHandlers, mTpOpts;
			if (isArray(mTypes)) {
				for (var tpNo = 0; tpNo < mTypes.length; tpNo++) {
					if (typeOf(curTpName = mTypes[tpNo], 'string')) {
						registerType.call(this, curTpName);
					}
				}
			} else if (typeOf(mTypes, 'object')) {
				for (var tpName in mTypes) {
					if (mTypes.hasOwnProperty(tpName)) {
						mCurType = mTypes[tpName];
						if (typeOf(mCurType, 'object')) {
							mHandlers = mCurType.handlers;
							mTpOpts = mCurType.opts;
						} else {
							mHandlers = mCurType;
						}
						registerType.call(this, tpName, mTpOpts);
						toggleHandlers.apply(this, [true, tpName, mHandlers]);
					}
				}
			}
		};
		/**
		 * @lends Callbacks.prototype
		 */
		return {
			/**
			 * Создает объект списка обработчиков
			 * @constructs
			 * @param {object} [oOptions] набор входных опций
			 * @see Callbacks#oDefOpts
			 */
			_Init: function (oOptions) {
				var oOpts = this._Opts = fExtend(true, {}, oDefOpts, oOptions), mTypes;
				this._Types = {};
				if ((mTypes = oOpts.Types)) {
					getTypes.call(this, mTypes);
				}
			},
			add: function () {
				oArrPttp.unshift.call(arguments, true);
				fToggle.apply(this, arguments);
			},
			once: function (sType, fHandler) {
				toggleHandlers.call(this, true, sType, {
					handler: fHandler,
					once: true
				});
			},
			remove: function () {
				oArrPttp.unshift.call(arguments, false);
				fToggle.apply(this, arguments);
			},
			fire: function (typeName, aArgs, oCntxt) {
				var oTypes = this._Types;
				var oCurType, aCurHndlrs, aParams, aTpHistory, maxLength, curLength;
				if (this._disabled || typeOf(oCurType = oTypes[typeName], 'undefined')) {
					return;
				}
				if (isArray(aCurHndlrs = oCurType.Handlers)) {
					aParams = oCurType.handlerParams;
					oCntxt = oCntxt || null;
					aArgs = aArgs || [];
					if (!(isArray(aArgs) || aArgs.hasOwnProperty('callee'))) { //XXX: Duck typing for Arguments object 
						aArgs = [aArgs];
					}
					for (var hndlrNo = 0; hndlrNo < aCurHndlrs.length; hndlrNo++) {
						aCurHndlrs[hndlrNo].apply(oCntxt, aArgs);
						if (aParams[hndlrNo].once) {
							removeHandler.call(this, oCurType, hndlrNo);
							//т.к. мы удалили один из обработчиков индекс следующего уменьшился
							hndlrNo--;
						}
					}
				}
				oCurType.fired = true;
				if ((aTpHistory = oCurType.History)) {
					oCurType.History.push({context: oCntxt, args: aArgs});
					if ((maxLength = aTpHistory.maxLength) && (curLength = aTpHistory.length) > maxLength) {
						//FIFO
						aTpHistory.splice(0, curLength - maxLength);
					}
				}
			},
			_disable: function () {
				this._disabled = true;
				this._Opts.Expandable = false;
			},
			_destroy: function () {
				this._disable();
				delete this._Types;
			},
			_addTypes: function (mTypes) {
				if (mTypes && this._Opts.Expandable === true) {
					getTypes.call(this, mTypes);
				}
			}
		};
	})());

	function Init(oOpts) {
		var oCbks = Callbacks(oOpts);
		var oRes = {
			bind: function () {
				oCbks.add.apply(oCbks, arguments);
			},
			once: function () {
				oCbks.once.apply(oCbks, arguments);
			},
			_fire: function () {
				var aArgs = oArrPttp.slice.call(arguments);
				if (typeOf(aArgs[2], 'undefined')) {
					aArgs[2] = this;
				}
				oCbks.fire.apply(oCbks, aArgs);
			}
		};
		if (oOpts.Expandable === true) {
			oRes._addCbkTypes = function () {
				oCbks._addTypes.apply(oCbks, arguments);
			};
		}
		fExtend(this, oRes);
	}
	
	/**
	 * Регистрирует или дополняет набор событий экземпляра
	 * @param {object} oOpts набор опций @see Callbacks
	 * @property {Types} oOpts набор опций
	 * @returns {undefined}
	 */
	function registerEventTypes(oOpts) {
		var oCallbacks, bExpandable;
		if (!typeOf(this, 'object') || this === window) {//чем черт не шутит
			return;
		}
		if (typeOf(this._addEventTypes, 'function')) {
			this._addEventTypes(oOpts.Types);
			return;
		}
		bExpandable = oOpts.Expandable = oOpts.Expandable !== false;
		oCallbacks = Callbacks(oOpts);
		fExtend(this, {
			_trigger: function () { //в отличии от _fire не ожидает контекста и передает обработчику все аргументы, кроме первого
				var aArgs = oArrPttp.slice.call(arguments);
				aArgs[1] = aArgs.splice(1, aArgs.length);
				aArgs[2] = this;
				oCallbacks.fire.apply(oCallbacks, aArgs);
			},
			on: oCallbacks.add.bind(oCallbacks),
			once: oCallbacks.once.bind(oCallbacks),
			off: oCallbacks.remove.bind(oCallbacks)
		});
		if (bExpandable) {
			this._addEventTypes = oCallbacks._addTypes.bind(oCallbacks);
		}
	}
	
	var oExports = {
		Tools: {
			Callbacks: Callbacks
		},
		Methods: {
			/**
			 * @deprecated
			 */
			initCallbacks: Init,
			registerEventTypes: registerEventTypes
		}
	};
	
	fExtend(true, oNS, oExports);
	/** @deprecated */
	fExtend(true, window.getNameSpace('Comp', oNS), oExports);
})(this, this.ru.mail.cpf);