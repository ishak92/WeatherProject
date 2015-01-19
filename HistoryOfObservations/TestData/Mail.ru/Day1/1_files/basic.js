(function (global) {
	'use strict';
	var oObjectPrototype = Object.prototype;
	var fHasOwnProperty = oObjectPrototype.hasOwnProperty;
	var oArrayProto = Array.prototype;
	var typeOf = (function () {
		var aClsNames = ['Object', 'Array', 'Boolean', 'Date', 'Function', 'Number', 'Null', 'RegExp', 'String', 'Undefined', 'Arguments', 'Error', 'Math', 'JSON'];
		var toStr = oObjectPrototype.toString;
		var oStrToType = {};
		var sObject = aClsNames[0].toLowerCase();
		var className;
		for (var classNo = aClsNames.length; classNo--;) {
			className = aClsNames[classNo];
			oStrToType['[' + sObject + ' ' + className + ']'] = className.toLowerCase();
		}
		return function (mObj, sType) {
			var sObjType = typeof mObj;
			if (sObjType === sObject || sObjType === 'function') {
				sObjType = mObj === null ? 'null' : oStrToType[toStr.call(mObj)] || sObject;
			}
			return sType ? sType === sObjType : sObjType;
		};
	})();
	var isArray = (function () {
		var fIsArray = Array.isArray;
		if (!typeOf(fIsArray, 'function')) {
			fIsArray = Array.isArray = function (array) {
				return typeOf(array, 'array');
			};
		}
		return function (array) {
			return fIsArray(array);
		};
	})();
	var getNameSpace = function (mName, oPrnt, bCreate) {
		var aName = !isArray(mName) ? mName.split('.') : mName;
		var oCurLevel = oPrnt || global;
		var sCurName, mNextLevel;
		bCreate = bCreate !== false;
		for (var lvlNo = 0; lvlNo < aName.length; lvlNo += 1) {
			sCurName = aName[lvlNo];
			mNextLevel = oCurLevel[sCurName];
			if (!typeOf(mNextLevel, 'object')) {
				if (bCreate) {
					oCurLevel[sCurName] = mNextLevel = {};
				} else {
					break;
				}
			}
			oCurLevel = mNextLevel;
		}
		return oCurLevel;
	};
	function getByPath(mName, oParent) {
		var aName = isArray(mName) ? mName : mName.split('.');
		var oTarget = getNameSpace(aName.slice(0, aName.length - 1), oParent, false);
		var mResult = null;
		if (!(oTarget === null || typeOf(oTarget, 'undefined'))) { //если не null или undef - можно получить свойство
			mResult = oTarget[aName.pop()];
		}
		return mResult;
	}
	function isPlainObject(mObject) {
		var bIsObject = mObject && typeOf(mObject, 'object') && !(mObject.nodeType ||  mObject === mObject.window);
		var sKeyName;
		try {
			bIsObject = bIsObject && !(
				mObject.constructor &&
				!fHasOwnProperty.call(mObject, 'constructor') &&
				!fHasOwnProperty.call(mObject.constructor.prototype, 'isPrototypeOf')
			);
		} catch (ex) {
			bIsObject = false;
		}
		if (bIsObject) {
			for (sKeyName in mObject) {} // находит последний ключ объекта
			bIsObject = typeOf(sKeyName, 'undefined') || fHasOwnProperty.call(mObject, sKeyName);
		}
		return bIsObject;
	}
	var extend = function () {
		var oTarget, aModifiers, isDeep, oProps, targetVal, modfVal, recCont, mdfrIsArr, trgtType;
		if (typeOf(arguments[0], 'boolean')) {
			isDeep = oArrayProto.shift.apply(arguments);
		}
		if (arguments.length < 2) {
			return;
		}
		oTarget = oArrayProto.shift.apply(arguments);
		trgtType = typeOf(oTarget);
		if (!(trgtType == 'object' || trgtType == 'function' || trgtType == 'array')) {
			oTarget = {};
		}
		aModifiers = arguments;
		for (var mdfNo = 0, mdfsLength = aModifiers.length; mdfNo < mdfsLength; mdfNo += 1) {
			if (/*(oProps = aModifiers[mdfNo]) !== null && */(typeOf(oProps = aModifiers[mdfNo], 'object') || isArray(oProps))) {
				for (var propName in oProps) {
					if (!(fHasOwnProperty.call(oProps, propName) && oProps[propName] !== oTarget)) {
						continue;
					}
					targetVal = oTarget[propName];
					modfVal = oProps[propName];
					if ((mdfrIsArr = isArray(modfVal)) || (typeOf(modfVal, 'object') && isPlainObject(modfVal)) && isDeep) {
						if (mdfrIsArr) {
							recCont = isArray(targetVal) ? targetVal : [];
						} else {
							recCont = typeOf(targetVal, 'object') ? targetVal : {};
						}
						oTarget[propName] = extend(true, recCont, modfVal); //TODO первый аргумент - {}
					} else if (!typeOf(modfVal, 'undefined')) {
						oTarget[propName] = modfVal;
					}
				}
			}
		}
		return oTarget;
	};
	var merge = function () {
		var aArgs = [], isDeep = false;
		var mCurProp, mTrgtProp, oCurVal, oTarget, curType, trgtType;
		if (typeOf(arguments[0], 'boolean')) {
			isDeep = oArrayProto.shift.call(arguments);
		}
		for (var argNo = 0; argNo < arguments.length; argNo++) {
			if (typeOf(oCurVal = arguments[argNo], 'object')) {
				aArgs.push(oCurVal);
			}
		}
		oTarget = aArgs.shift();
		if (aArgs.length) {
			for (argNo = 0; argNo < aArgs.length; argNo++) {
				oCurVal = aArgs[argNo];
				for (var propName in oCurVal) {
					if (fHasOwnProperty.call(oCurVal, propName)) {
						if ((mCurProp = oCurVal[propName]) != (mTrgtProp = oTarget[propName])) {
							curType = typeOf(mCurProp);
							trgtType = typeOf(mTrgtProp);
							if (curType === trgtType && curType === 'object' && isDeep) {
								oTarget[propName] = merge(true, {}, mTrgtProp, mCurProp);
							} else if (trgtType != 'undefined') {
								oTarget[propName] = [].concat(mTrgtProp, mCurProp);
							} else {
								oTarget[propName] = mCurProp;
							}
						}
					}
				}
			}
		}
		return oTarget;
	};
	var getOptions = (function () {
		var sTargetPropName = 'onclick';
		var sStorePropName = '_options';
		return function (elNode) {
			var mOnclck = elNode[sTargetPropName];
			var mStored = elNode[sStorePropName];
			var retVal;
			if (mOnclck != null) {
				try {
					retVal = mOnclck();
				} catch (ex) {}
				elNode.removeAttribute(sTargetPropName);
				/*delete */
				elNode[sTargetPropName] = null;
				elNode[sStorePropName] = retVal;
			} else if (mStored != null) {
				retVal = mStored;
			}
			return retVal;
		};
	})();
	/**
	 * Создает конструктор обрабатывающий вызов без оператора new
	 * @param {object} [oPrttp] прототип, ассоциируемый с создаваемым конструктором
	 * @returns {function} Конструктор
	 */
	function getConstructor(oProto) {
		var fConstructor = function () {
			var oInstance = this;
			var mInitResult;
			//XXX: Запрет вызова без new
			if (!(oInstance instanceof fConstructor)) {
				oInstance = new fConstructor(fConstructor);
			}
			//XXX: Если в качестве аргумента передан сам конструктор значит требуется только инициализация объекта (new)
			if (!(arguments[0] === fConstructor && arguments.length === 1)) {
				mInitResult = oInstance._Init.apply(oInstance, arguments);
				if (typeOf(mInitResult, 'object')) {
					oInstance = mInitResult;
				} else {
					oInstance._Init = null;
				}
			}
			return oInstance;
		};
		if (typeOf(oProto, 'object')) {
			fConstructor.prototype = oProto;
			fConstructor.prototype.constructor = fConstructor;
		}
		return fConstructor;
	}
	var oModuleOpts = (function () {
		var oOptions;
		function getPrjctNs(sPrjctName) {
			if (!sPrjctName) {
				sPrjctName = 'location' in global && global.location.hostname.split('.').slice(0, -2).join('.') || '';
			}
			oOptions = oOptions || {};
			return getNameSpace(sPrjctName, oOptions);
		}
		return {
			get: function (sMdleName, sPrjctName) {
				var oPrjctNs = getPrjctNs(sPrjctName);
				return oPrjctNs[sMdleName];
			},
			set: function (sMdleName, sPrjctName, oOpts, bRewrite) {
				var oPrjctNs = getPrjctNs(sPrjctName);
				var oMdlNs = oPrjctNs[sMdleName];
				if (!oMdlNs || bRewrite) {
					oMdlNs = oPrjctNs[sMdleName] = extend(true, {}, oOpts);
				} else {
					extend(true, oMdlNs, oOpts);
				}
				return oMdlNs;
			}
		};
	})();
	var oNS = getNameSpace('ru.mail.cntnt_prjcts');
	//переезжаем на новое имя неймспейса
	extend(getNameSpace('ru.mail'), {
		cpf: oNS
	});
	extend(getNameSpace('Basic', oNS), {
		Extend: extend,
		Merge: merge,
		getOptions: getOptions,
		moduleOpts: oModuleOpts,
		typeOf: typeOf,
		getConstructor: getConstructor,
		getByPath: getByPath
	});
	extend(getNameSpace('Types.Array', oNS), {
		isArray: isArray
	});
	global.getNameSpace = getNameSpace;
}(new Function('return this')()));