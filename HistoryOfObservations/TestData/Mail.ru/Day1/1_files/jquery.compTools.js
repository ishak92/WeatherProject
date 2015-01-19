/**
 * @require 'lib/basic.js'
 * @require 'tools/jquery/jquery.compElems.js'
 */
(function ($, window, oNS) {
	var fGetNs = window.getNameSpace;
	var oBasic = oNS.Basic;
	var typeOf = oBasic.typeOf;
	var oArrPttp = Array.prototype;
	var oJqComp = fGetNs('Comp.jQuery', oNS);
	oBasic.Extend(oJqComp, (function () {
		/**
		 * @deprecated
		 */
		function fGetElements(oSels, jCont, oElmNS) {
			var reContName = /^in/i; //TODO: добавить /^to/i - запись эл-тов во влож. св-во
			var curSel, contName, selType, elName, jElem, jElemCont;
			oElmNS = oElmNS || {};
			for (var selName in oSels) {
				if (oSels.hasOwnProperty(selName)) {
					curSel = oSels[selName];
					selType = typeOf(curSel);
					if (selType == 'string' && curSel.length) {
						elName = 'j' + selName.substr(0, 1).toUpperCase() + selName.substr(1);
						oElmNS[elName] = (jElem = jCont.find(curSel)).length ? jElem : jCont.is(curSel) ? jCont : null;
					} else if (selType == 'object') {
						contName = 'j' + (selName.replace(reContName, ''));
						jElemCont = oElmNS[contName];
						if (jElemCont instanceof $ && jElemCont.length) {
							fGetElements(curSel, jElemCont, oElmNS);
						}
					}
				}
			}
			return oElmNS;
		}
		var oWinHndlrs = (function () {
			var jWindow = oJqComp.Elems.jWindow;
			var aHndlrTypes = ['scroll', 'resize'];
			var oHandlers;
			var fToggleHndlrs = function () {
				/* получаем ссылку на тул в момент исполнения,
				 * т.к. скрипт с ним мог быть подключен позже(?)
				 */
				var Collbacks = oNS.Comp.Tools.Callbacks;
				var oArgs = arguments;
				var bAttach = typeOf(oArgs[0], 'boolean') ? oArrPttp.shift.apply(oArgs) : true;
				var fCurHndlr;
				if (!typeOf(Collbacks, 'function')) {
					return;
				}
				if (bAttach && typeOf(oHandlers, 'undefined')) {
					oHandlers = Collbacks({Types: aHndlrTypes});
					jWindow.bind(aHndlrTypes.join(' '), function (e) {
						var evtType = e.type;
						oHandlers.fire(evtType, [{
							top: jWindow.scrollTop(),
							left: jWindow.scrollLeft()
						}, {
							height: jWindow.height(),
							width: jWindow.width()
						}, evtType]);
					});
				}
				if (!typeOf(oHandlers, 'undefined')) {
					for (var hndlrNo = 0; hndlrNo < aHndlrTypes.length; hndlrNo++) {
						fCurHndlr = arguments[hndlrNo];
						if (typeOf(fCurHndlr, 'undefined')) {
							//если обработчик один (второй аргумент - udef) - назначаем его на оба события
							fCurHndlr = arguments[hndlrNo - 1];
						}
						if (typeOf(fCurHndlr, 'function')) {
							oHandlers[bAttach ? 'add' : 'remove'](aHndlrTypes[hndlrNo], fCurHndlr);
						}
					}
				}
			};
			return {
				attach: fToggleHndlrs,
				detach: function () {
					oArrPttp.unshift.call(arguments, false);
					fToggleHndlrs.apply(null, arguments);
				}
			};
		})();
		/**
		 * Получает либо устанавливает содержимое/значения целевых элементов
		 * @param {object} oElems ссылки на элементы
		 * @param {object} [oVals] значения для установки
		 * @param {object} [oConformity] словарь соответствий ключей первых двух аргументов
		 * @returns {object} oVals содержимое/значения элементов
		 */
		var fToggleVals = function (oElems, oVals, oConformity) {
			oVals = oVals || {};
			var jElem, sFncName, curVal, sTextKey;
			for (var elmName in oElems) {
				if (oElems.hasOwnProperty(elmName) && (jElem = oElems[elmName]) && jElem.length) {
					sFncName = jElem.is('input, select, textarea') ? 'val' : 'html';
					sTextKey = oConformity && elmName in oConformity ? oConformity[elmName] : elmName;
					if ((curVal = oVals[sTextKey])) {
						jElem[sFncName](curVal);
					} else {
						oVals[sTextKey] = jElem[sFncName]();
					}
				}
			}
			return oVals;
		};
		var oTools = {
			Tools: {
				getElements: fGetElements,
				winHndlrs: oWinHndlrs,
				toggleElemsVal: fToggleVals
			}
		};
		return oTools;
	})());
})(jQuery, window, getNameSpace('ru.mail.cpf'));