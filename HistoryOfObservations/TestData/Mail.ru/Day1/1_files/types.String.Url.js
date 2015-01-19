/**
 *  @required 'lib/basic.js'
 *  @required 'lib/polyfills/es5.array.js'
 */
(function (window, oNS, undef) {
	"use strict";
	var fGetNs = window.getNameSpace;
	var oBasic = fGetNs('Basic', oNS);
	var typeOf = oBasic.typeOf;
	var fExtend = oBasic.Extend;
	var reDomainPath = /^\/?([^=&#\/]+\/)+[^=&#\/]*$/;
	var reDomain = /^(http(s?):)?\/\/[^\/]+/i;
	var reUrlParamName = /([a-z-_]+)([0-9,]+)/i;
	var oVarTypes = {'true': !0, 'false': !1, 'null': null, 'undefined': null, '': null};

	//  Polyfill для trim TODO: в lib/pollyfils
	if (!String.prototype.trim) {
		String.prototype.trim = function () {
			return this.replace(/^\s+|\s+$/g, '');
		};
	}
	/**
	 * Сериализует значение одного параметра
	 * @param {boolean} paramIsArray флаг, указывающий что параметр - часть массива
	 * @param {string} sParentName имя параметра-родителя
	 * @param {mixed} mValue значение параметра
	 * @param {string} sKey имя параметра
	 * @returns {array|string} mResult результат сериализации
	 */
	function processOneParam(paramIsArray, sParentName, mValue, sKey) {
		var mResult, aValue;
		if (sParentName) {
			sKey = [sParentName, '[', (paramIsArray ? '' : sKey), ']'].join('');
		}
		switch (typeOf(mValue)) {
		case 'array':
		case 'object':
			mResult = fSerialize(mValue, sKey);
			break;
		default:
			aValue = [encodeURIComponent(sKey)];
			if (mValue != null && mValue.length !== 0) {//undefined, null или пустая строка
				//XXX '?' зарезервирован для jQuery-style запросов jsonp
				aValue.push(mValue !== '?' ? encodeURIComponent(mValue) : mValue);
			}
			mResult = aValue.join('=');
			break;
		}
		return mResult;
	}
	function reduceParams(mParams, sParentName, aResult, mElemVal) {
		var paramIsArray = mParams === null;
		return aResult.concat(processOneParam(
			paramIsArray, sParentName,
			paramIsArray ? mElemVal : mParams[mElemVal],
			paramIsArray ? null : mElemVal
		));
	}
	/**
	 * Рекурсивная сериализация объекта или массива
	 * @param {object|array} mParams Данные для обработки
	 * @param {string} [sParentName] Имя родительского элемента
	 * @returns {array} aResult плоский массив пар ключ=значение
	 */
	function fSerialize(mParams, sParentName) {
		var aResult = [];
		switch (typeOf(mParams)) {
		case 'array':
			aResult = mParams.reduce(reduceParams.bind(null, null, sParentName), aResult);
			break;
		case 'object':
			aResult = Object.keys(mParams).reduce(reduceParams.bind(null, mParams, sParentName), aResult);
			break;
		default:
			break;
		}
		return aResult;
	}

	/**
	 * Получение строки из объекта/массива
	 * @param {object|Array} mParams
	 * @returns {string}
	 */
	function fStringify(mParams) {
		var aResult = fSerialize(mParams);
		return aResult.join('&').replace(/%20/g, '+');
	}

	/**
	 * Разделение урла на составные части
	 * @param {string} [sUrl]
	 * @returns {object}
	 */
	function fSplitUrl(sUrl) {
		var oUrl = {
			path: '',
			query: '',
			hash: ''
		};
		var aUrlParts, bHashSplit;

		if (!sUrl) {
			return oUrl;
		}
		sUrl = sUrl.replace( /\+/g, ' ').trim();
		if (sUrl.indexOf('?') >= 0) {
			aUrlParts = sUrl.split('?');
			oUrl.path = aUrlParts[0];
			sUrl = aUrlParts[1];
		} else if (reDomainPath.test((aUrlParts = sUrl.split('#'))[0]) || reDomain.test(aUrlParts[0])) {
			oUrl.path = aUrlParts[0] || '';
			oUrl.hash = aUrlParts[1] || '';
			bHashSplit = true;
		} else {
			oUrl.query = sUrl;
		}
		if (!bHashSplit) {
			aUrlParts = sUrl.split('#');
			oUrl.query = aUrlParts[0] || '';
			oUrl.hash = aUrlParts[1] || '';
		}
		return oUrl;
	}

	/**
	 *  Получение массива из ключа 'b[z][]' -> ['b', 'z', '']
	 *  @param {string} sKey
	 *  @returns {Array}
	 */
	function fParseKey (sKey){
		//'b[z][]'.replace(/]/g, '').split('[')//TODO: ?
		var aKeys = sKey.split('][');
		aKeys = aKeys.shift().split('[').concat(aKeys);
		aKeys[aKeys.length - 1] = aKeys[aKeys.length - 1].replace(']', '');
		return aKeys;
	}

	/**
	 *  Преобразование строки значения параметра в наиболее подходящий тип данных
	 *  @param {string} sValue
	 *  @returns {number|boolean|undefined|null|string}
	 */
	function fParseValue (sValue){
		return sValue && !isNaN(sValue) ? +sValue  // number
			: oVarTypes[sValue] !== undef ? oVarTypes[sValue]  // true, false, null, undefined -> null
			: sValue;  // string
	}

	/**
	 *  Разбирает урл на составные части
	 *  @param {string} sUrl
	 *  @returns {object}
	 */
	function fParseUrl(sUrl) {
		var oUrl = fSplitUrl(sUrl);
		oUrl.query = fGetParams(oUrl.query, false) || {};
		return oUrl;
	}


	/**
	 *  Сериализация пар "ключ:значение", добавление их к переданному url
	 *  @param {object} oParams  Набор параметров
	 *  @param {string} [sUrl]
	 *  @param {boolean} [bReplace=false]  Флаг, что все старые параметры надо убрать
	 *  @returns {string}
	 */
	//TODO bReplace - замена текущего значения параметра, а не его доплонениея (сейчас происходит по-умолчанию)
	function fAddParams(oParams, sUrl, bReplace) {
		var oUrl = fParseUrl(sUrl);
		var sPath = oUrl.path;
		var sHash = oUrl.hash;
		var sQuery = fStringify(fExtend(true, {}, bReplace ? {} : oUrl.query, oParams));
		return sPath + (sPath && sQuery ? '?' : '') + sQuery + (sHash ? '#' + sHash : '');
	}
	
	/**
	 *  Добавление одного параметра к урлу
	 *  @param {string} sUrl
	 *  @param {string} sName
	 *  @param {mixed} mValue
	 *  @param {boolean} bReplace  Флаг, что другие параметры надо удалить
	 */
	function fAddOneParam(sUrl, sName, mValue, bReplace) {
		var oParam = {};
		oParam[sName] = mValue;
		return fAddParams(oParam, sUrl, bReplace);
	}

	/**
	 *  Десериализация параметров из абсолютного или относительного урла
	 *  @param {string} sUrl
	 *  @param {boolean} [bSplitUrl=true]  Флаг, что урл надо разобрать на части
	 *  @returns {object|null}
	 */
	function fGetParams (sUrl, bSplitUrl) {
		var oResult = {};

		if (typeOf(bSplitUrl, 'undefined') ? true : bSplitUrl) {
			sUrl = fSplitUrl(sUrl).query;
		}
		if (!sUrl) {
			return null;
		}
		sUrl.split('&').forEach(function (sValue) {
			var aParams = sValue.split('=');
			var oCur = oResult;
			var aKeys, sVal, iLen, sKey, i;

			if (typeOf(aParams[1], 'undefined')) { // атрибуты со значением, но без знака "="
				aParams = sValue.match(reUrlParamName);
				if (aParams) {
					aParams = aParams.slice(1);
				} else {
					aParams = [sValue, null];
				}
			}
			aKeys = fParseKey(decodeURIComponent(aParams[0]));
			sVal = fParseValue(decodeURIComponent(aParams[1]));
			iLen = aKeys.length;

			if (iLen > 1) { // Сложный ключ TODO: tests
				for (i = 0; i < iLen; i++) {
					sKey = (aKeys[i] === '') ? oCur.length : aKeys[i];
					if (i < iLen - 1) {
						// Если текущий уровень undefined
						// создаем объект или массив, основанный на типе данных следующей части ключа
						oCur = oCur[sKey] = oCur[sKey] || ( aKeys[i + 1] && isNaN(aKeys[i + 1]) ? {} : []);
					} else {
						// Для последней части ключа подставляем значение
						oCur = oCur[sKey] = sVal;
					}
				}
			} else {
				oResult[aKeys[0]] = sVal;
			}
		});
		return oResult;
	}

	/**
	 *  Получение абсолютного урла из переданного
	 *  @param {string} sUrl
	 *  @returns {string}
	 */
	function fGetAbs (sUrl) {  // TODO: tests
		var oLocation = window.location;
		if (typeOf(sUrl, 'string')) {
			sUrl = sUrl.trim();
			if (!reDomain.test(sUrl)) {
				sUrl = oLocation.protocol + '//' + oLocation.hostname + (sUrl.charAt(0) == '/' ? '' : oLocation.pathname) + sUrl;
			}
			return sUrl;
		}
	}

	// Подмешиваем методы в Types.String
	oBasic.Extend(fGetNs('Types.String.Url', oNS), {
		getAbs: fGetAbs,
		addParam: fAddOneParam,
		addParams: fAddParams,
		getParams: fGetParams
	});

})(this, this.ru.mail.cpf);