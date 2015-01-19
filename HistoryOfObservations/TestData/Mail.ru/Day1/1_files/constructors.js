/**
 * Фабрики конструкторов моделей и представлений, выполняющие часть рутинной работы
 * @requires 'lib/basic.js'
 * @requires 'lib/polyfills/es5.basic.js'
 * @requires 'lib/polyfills/es5.array.js'
 * @requires 'tools/tools.Callbacks.js'
 */

(function (window, oNS) {
	var oBasic = oNS.Basic;
	var typeOf = oBasic.typeOf;
	var fExtend = oBasic.Extend;
	var fMerge = oBasic.Merge;
	var fGetConstructor = oBasic.getConstructor;
	//var isArray = oNS.Types.Array.isArray;
	var fGetByPath = oBasic.getByPath;
	var oModuleOpts = oBasic.moduleOpts;
	var aServiceProps = ['_Events', '_Parent', '_Handlers', '_parentElement'];
	var aEventCategories = ['self', 'dom', 'model', 'set'];
	function addEventTypes(oTypes) {
		oNS.Methods.registerEventTypes.call(this, {
			Types: oTypes
		});
	}
	function addHandlersSet(sSetName, aParams, mHandlers) {
		var oSets, oCurrentSet;
		if ('_bindHandlerSet' in this) {
			oSets = this._bindHandlerSet._Sets;
		} else {
			oSets = {};
			this._bindHandlerSet = bindHandlerSet.bind(this, oSets);
			this._bindHandlerSet._Sets = oSets;
		}
		oCurrentSet = oSets[sSetName] = oSets[sSetName] || {};
		if (aEventCategories.indexOf(aParams[0]) < 0) {
			aParams.unshift('dom');
		}
		oCurrentSet[aParams.join(':')] = mHandlers;
		return oSets;
	}
	function bindHandlerSet(oSets, sSetName) {
		var oSet = oSets[sSetName];
		if (typeOf(oSet, 'object')) {
			bindHandlers.call(this, oSet, null, sSetName);
			delete oSets[sSetName];
		}
	}
	/**
	 * Назначает обработчики событий
	 * @param {object} oHandlers хеш сответствий параметры события - обработчик или имя метода
	 * @param {string} sBaseParams строка "базовых" параметров, используется при рекурсивном вызове
	 * @param {string} [sBindSet] имя набора обработчиков, используется для назначения dom-обработчиков элементам отличным от Parent
	 * Параметры событий записываются строкой, разделенный символом ".", например: <event_type>:<event_name>:<selector_path>
	 * <selector_path> опускается для типов отличных от "dom", <event_type> по-умолчанию равен "self" (обработчик события экземпляра)
	 */
	function bindHandlers(oHandlers, sBaseParams, sBindSet) {
		var oElems = this._Elems;
		var aEventParams, sEventType, sEventName, mSelectorPath, sSelector;
		var mBindTo, mParamsValue, sValueType, mHandlers;//, oSets, sSetName, oCurrentSet;
		//TODO обработчики событий для инстансов из произвольных свойств
		for (var sEventParams in oHandlers) {
			if (oHandlers.hasOwnProperty(sEventParams)) {
				mParamsValue = oHandlers[sEventParams];
				sValueType = typeOf(mParamsValue);
				if (sBaseParams) {
					sEventParams = [sBaseParams, sEventParams].join(':');
				}
				aEventParams = sEventParams.split(':');
				if (aEventCategories.indexOf(aEventParams[0]) > -1) {
					sEventType = aEventParams.shift();
				} else {
					sEventType = aEventCategories[0];
				}
				sEventName = aEventParams.shift();
				if (sEventType === 'set') {
					addHandlersSet.call(this, sEventName, aEventParams, mParamsValue);
					continue;
				}
				switch (sValueType) {
				case 'string': //Имя метода текущего экземпляра
					mHandlers = this[mParamsValue];
					break;
				case 'function':
				case 'array':
					mHandlers = mParamsValue;
					break;
				case 'object':
					bindHandlers.call(this, mParamsValue, sEventParams, sBindSet);
					continue;
				default:
					continue;
				}
				if (typeOf(mHandlers, 'function')) {
					mHandlers = mHandlers.bind(this);
				} else if (Array.isArray(mHandlers) && sEventType !== 'dom') {
					for (var handlerNo = mHandlers.length, mHandler; handlerNo --;) {
						mHandler = mHandlers[handlerNo];
						if (typeOf(mHandler, 'string')) {
							mHandler = this[mHandler];
						}
						if (!typeOf(mHandler, 'function')) {
							mHandlers.splice(handlerNo, 1);
						} else {
							mHandlers[handlerNo] = mHandler.bind(this);
						}
					}
					if (mHandlers.length < 1) {
						continue;
					}
				} else {
					continue;
				}
				sSelector = null;
				switch (sEventType) {
				case aEventCategories[0]:
					mBindTo = this;
					break;
				case aEventCategories[1]:
					if ('_Elems' in this) {
						mSelectorPath = aEventParams.shift();
						//делегирование события документу, а не елементу родителя, определяется префиксом "$"
						if (mSelectorPath && mSelectorPath.charAt(0) === '$') {
							mSelectorPath = mSelectorPath.substr(1);
							//оборачиваем документ в инстанс библиотеки для работы с DOM (jQuery, например)
							mBindTo = oElems.Parent.constructor.call(null, window.document);
						} else {
							mBindTo = sBindSet && oElems[sBindSet] || oElems.Parent;
						}
						if (mSelectorPath) {
							mSelectorPath = mSelectorPath.split('.');
							sSelector = fGetByPath(mSelectorPath, this._Opts.cssSels);
							//XXX если указан путь к селектору, но не указан селектор - не назначаем обработчик
							if (!sSelector) {
								mBindTo = null;
							}
						}
					}
					break;
				case aEventCategories[2]:
					mBindTo = this._Model;
					break;
				}
				if (mBindTo) {
					if (typeOf(sSelector, 'string') && sSelector.length) {
						mBindTo.on(sEventName, sSelector, mHandlers);
					} else {
						mBindTo.on(sEventName, mHandlers);
					}
				}
			}
		}
	}
	function processParent(fParentConstructor, oPrototype) {
		var oParentPrototype;
		if (typeOf(fParentConstructor, 'function') && typeOf(oParentPrototype = fParentConstructor.prototype, 'object')) {
			if (!('_Init' in oPrototype)) {
				oPrototype._Init = null;
			}
			oPrototype = fExtend(Object.create(oParentPrototype), oPrototype);
			oPrototype._Parent = oParentPrototype;
		}
		return oPrototype;
	}
	function processElementGet(sSelector, selName, oElems) {
		var mFindElement;
		if (typeOf(sSelector, 'string') && !(oElems[selName] && oElems[selName].length)) {
			mFindElement = oElems.Parent.find(sSelector);
			oElems[selName] = mFindElement && mFindElement.length > 0 ? mFindElement : null;
		}
		return oElems[selName];
	}
	/**
	 * Получает набор элементов на основании плоского хеша (имя елемента - селектор), елементы ищутся в рамках единого родителя
	 * @param {object|string} mSelectors список селекторов для поиска или один селектор
	 * @param {object|string} [mElement] ссылка на элемент-родитель (jQuery-like set) или, если первый аргумент - строка, то имя елемента для поиска
	 * @returns {object|null} oElems список ссылок на найденные елементы или, если первый аргумент - строка, то результат поиска (jQuery-like set или null)
	 */
	function getElements(mSelectors, mElement) {
		var oElems = this._Elems;
		var oSelectors;
		if (typeOf(mSelectors, 'string')) {
			return processElementGet(mSelectors, mElement, oElems);
		} else {
			oSelectors = mSelectors;
			oElems = oElems || {Parent: mElement};
			if (oSelectors) {
				for (var selName in oSelectors) {
					if (oSelectors.hasOwnProperty(selName)) {
						processElementGet(oSelectors[selName], selName, oElems);
					}
				}
			}
		}
		return oElems;
	}
	function processPlugins() {
		var aPlugins = this._Plugins;
		var oPlugin, oHandlers, fInitPlugin;
		for (var pluginNo = 0; pluginNo < aPlugins.length; pluginNo++) {
			oPlugin = aPlugins[pluginNo];
			oHandlers = oPlugin._Handlers;
			fInitPlugin = oPlugin._Init;
			if (typeOf(oHandlers, 'object')) {
				bindHandlers.call(this, oHandlers);
			}
			if (typeOf(fInitPlugin, 'function')) {
				fInitPlugin.call(this);
			}
		}
		//после инициализации затираем ссылку на набор плагинов
		this._Plugins = null;
	}

	/**
	 * Оборачивает метод _Init, функцией, выполняющей предварительную инициализацию модуля
	 * @param {boolean} bIsModel
	 * @param {object} oPrototype
	 * @param {object} [oDefOptions]
	 * @param {object || array} [mEventTypes]
	 * @param {object} [oHandlers]
	 * @param {function || object} mDefParentElement (jQuery-like set)
	 * @param {string} [sModuleName]
	 */
	function wrapInitFunction(bIsModel, oPrototype, oDefOptions, mEventTypes, oHandlers, mDefParentElement, sModuleName) {
		var fOriginalInit = oPrototype._Init;
		function isElementsSet(oArgument) { //XXX duck typing на время поддержки старого порядка аргументов
			return !isNaN(oArgument.length) && typeOf(oArgument.constructor.fn, 'object');
		}
		oPrototype._Init = function () {
			var aArguments = Array.prototype.slice.call(arguments);
			var oOpts = fExtend(true, {}, oDefOptions);
			var bHasPlugins = oPrototype.hasOwnProperty('_Plugins');
			var sHandlersOpt = '_Handlers';
			var mParentElem, oModel, oSels, oMainSels, mReturnVal, oOptsHandlers, oCurHandlers;
			if (bHasPlugins) {
				oPrototype._Plugins.forEach(function (oPlugin) {
					var oPluginOpts = oPlugin._Opts;
					if (typeOf(oPluginOpts, 'object')) {
						fExtend(true, oOpts, oPluginOpts);
					}
				});
			}
			if (sModuleName) {
				fExtend(true, oOpts, oModuleOpts.get(sModuleName));
			}
			aArguments[0] = fExtend(true, oOpts, aArguments[0]); //XXX опции инициализации - всегда первый аргумент
			if (mEventTypes) {
				addEventTypes.call(this, mEventTypes);
			}
			if (!bIsModel) {
				mParentElem = aArguments[1];
				oModel = aArguments[2];
				//проверяем и нормализуем порядок аргументов
				if (
					(typeOf(mParentElem, 'object') && !isElementsSet(mParentElem)) ||
					(typeOf(oModel, 'object') && isElementsSet(oModel))
				) {
					mParentElem = oModel;
					oModel = aArguments[2] = aArguments[1];
				}
				//если у потомка есть родительский елемент по-умолчанию - он должен быть передан в инициализацию предка
				mParentElem = aArguments[1] = mParentElem || mDefParentElement;
				if (oModel && !typeOf(oModel.on, 'function')) {//не уверен, что эта проверка нужна
					throw new TypeError('View instance must be linked with an instance of the model that has "on" method for add handlers');
				}
				this._Model = this._Model || oModel || null;

			}
			if (oPrototype._Parent) { //TODO разобраться с тем, что возвращает инициализация родителя
				oPrototype._Parent._Init.apply(this, aArguments);
			}
			oOpts = this._Opts = this._Opts || oOpts;
			//все опции, для которых критичен порядок раcширения доезжают до самой верхней инициализации
			if (sHandlersOpt in oOpts) {
				oOptsHandlers = oOpts[sHandlersOpt];
				delete oOpts[sHandlersOpt];
				if (typeOf(oOptsHandlers, 'object')) {
					oCurHandlers = fMerge(true, {}, oHandlers || {}, oOptsHandlers);
				}
			} else {
				oCurHandlers = oHandlers;
			}
			if (!(bIsModel || '_Elems' in this)) {
				if (typeOf(mParentElem, 'function')) {
					mParentElem = mParentElem.call(this);
				}
				oSels = oOpts.cssSels;
				oMainSels = oSels && oSels.Main;
				this._Elems = this._getElements(oMainSels, mParentElem);
			}
			if (typeOf(oCurHandlers, 'object')) {
				bindHandlers.call(this, oCurHandlers);
			}
			aArguments.shift(); //В оригинальную инициализацию аргумент с опциями не приходит
			if (!bIsModel) {
				aArguments.splice(0, 2); //Для вьюхи удаляем ссылку на модель и елемент-родитель
			}
			if (typeOf(fOriginalInit, 'function')) {
				mReturnVal = fOriginalInit.apply(this, aArguments);
			}
			if (oPrototype.hasOwnProperty('_Plugins')) {
				processPlugins.call(this);
			}
			return mReturnVal;
		};
	}
	/**
	 * Создает конструктор модуля
	 * @param {boolean} bIsModel флаг, указывающий на то, что конструктор предназначается для модели
	 * @param {object} oPrototype объект прототипа (будет расширен стандартными методами), может содержать служебные свойства
	 * @property {function} [_Init] функция, вызываемая при конструировании экземпляра
	 * @property {object|array} [_Events] конфиг для инициализации/дополнения событий модуля в формате tools.Callbacks.js
	 * @property {object} [_Handlers] конфиг обработчиков (только для модулей представления)
	 * @property {object} [_parentElement] ссылка на родительский элемент представления, либо функцию, его возвращающую (только для модулей представления)
	 * @param {object} [oDefOptions] набор опций по-умолчанию
	 * @param {function} [fParentConstructor] конструктор родителя
	 * @param {string} [sModuleName] имя модуля
	 */
	function createModuleConstructor(bIsModel, oPrototype, oDefOptions, fParentConstructor, sModuleName) {
		var mEventTypes, oHandlers = null, mParentElement = null;
		if (!typeOf(oPrototype, 'object')) {
			throw new TypeError('Prototype must be an object');
		}
		bIsModel = bIsModel !== false;
		//получаем значения служебных свойств до смешениея прототипов и удалчяем эти свойства
		if (!bIsModel) {
			oHandlers = oPrototype._Handlers;
			mParentElement = oPrototype._parentElement;
		}
		mEventTypes = oPrototype._Events;
		aServiceProps.forEach(function (propName) {
			delete oPrototype[propName];
		});
		oPrototype = processParent(fParentConstructor, oPrototype);
		oPrototype._getElements = getElements;
		wrapInitFunction(bIsModel, oPrototype, oDefOptions, mEventTypes, oHandlers, mParentElement, sModuleName);
		return fGetConstructor(oPrototype);
	}
	oBasic.Constructors = {
		getModel: createModuleConstructor.bind(null, true),
		getView: createModuleConstructor.bind(null, false),
		_getServiceProps: function () {
			return aServiceProps.slice(0);
		}
	};
	/**
	 * @deprecated
	 */
	fExtend(oBasic, {
		getModel: oBasic.Constructors.getModel,
		getView: oBasic.Constructors.getView
	});
}(this, this.ru.mail.cpf));