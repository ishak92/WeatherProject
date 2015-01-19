/**
 *  Утилиты для работы со строками
 *  @requires 'lib/basic.js'
 */
(function (window, oNS) {
	"use strict";
	var fGetNs = window.getNameSpace;
	var oBasic = fGetNs('Basic', oNS);
	var typeOf = oBasic.typeOf;

	oBasic.Extend(fGetNs('Types.String', oNS), (function () {
		var oStringProto = String.prototype;
		var getNearest = function (sHaystack, aSearch, iStrt) {
			var sSrch, curPos, minPos = -1;
			iStrt = iStrt || 0;
			for (var srchNo = 0; srchNo < aSearch.length; srchNo++) {
				if (typeOf(sSrch = aSearch[srchNo], 'string') && (curPos = sHaystack.indexOf(sSrch, iStrt)) > -1) {
					minPos = Math[minPos < 0 ? 'max' : 'min'](curPos, minPos);
				}
			}
			return minPos;
		};
		var trimString = (function () {
			var fNative = oStringProto.trim;
			var fTrim;
			if (typeOf(fNative, 'function')) {
				fTrim = fNative;
			} else {
				fTrim = function () {
					return this.replace(/^\s+|\s+$/g, '');
				};
				oStringProto.trim = fTrim;
			}
			return function (mText) {
				return oStringProto.toString.call(mText).trim();
			};
		})();
		/**
		 *  Склонение слова в зависимости от числа
		 *  @param {number} num  Число, для которого склоняем
		 *  @param {Array} aEnds  Набор склонений в порядке: 1, 2, 5
		 *  @returns {string}  Существительное в правильном склонении
		 */
		var fGetPlrl = function (num, aEnds) {
			num = num % 100;
			if (num > 10 && num < 20) {
				return aEnds[2];
			} else {
				num = num % 10;
				switch (num) {
				case 1:
					return aEnds[0];
				case 2:
				case 3:
				case 4:
					return aEnds[1];
				default:
					return aEnds[2];
				}
			}
		};

		/**
		 *  Уменьшение строки под заданный лимит по ближайшему к максимуму промежутку между словами
		 *  @param {string} sStr  Строка для обработки
		 *  @param {number} iLimit  Максимально допустимый размер строки
		 *  @returns {string}  Результат работы функции
		 */
		var fCutBySpace = function (sStr, iLimit) {
			var sResult;
			if (sStr.length <= iLimit) { // Если обрезать не надо
				return sStr;
			}
			sResult = sStr.substr(0, iLimit);
			if (sStr.charAt(iLimit) != ' ') {
				sResult = sResult.substr(0, sResult.lastIndexOf(' '));
			}
			return sResult;
		};

		return {
			getPlural: fGetPlrl,
			trim: trimString,
			getNearest: getNearest,
			cutBySpace: fCutBySpace,
			regExp: { // required
				Url: /^(?:http(?:s)?:\/\/)?(?:(?:[a-z0-9\-]+\.)+[a-z]{2,4})?\/?(?:[a-z0-9\-_]+(?:\/|(?:\.[a-z0-9]+)))*(?:\?.*)?$/i
			}
		};
	})());
})(this, this.ru.mail.cpf);