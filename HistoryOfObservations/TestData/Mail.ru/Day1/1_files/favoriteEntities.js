/**
 * Абстрактный контроллер избранных сущностей
 *  @require 'lib/basic.js'
 *  @require 'lib/constructors.js'
 *  @require 'tools/tools.Callbacks.js'
 */
(function (window, oNS) {
	var oBasic = oNS.Basic;
	var typeOf = oBasic.typeOf;
	var isArray = oNS.Types.Array.isArray;
	var Favorites = oBasic.getModel(function () {
		function getFavoritesArray() {
			var oFavorites = this._Favorites;
			return Object.keys(oFavorites).map(function (sEntityId) {
				return oFavorites[sEntityId] ? sEntityId : null;
			})
		}
		function hOnGetListData(mData) {
			var oFavorites = this._Favorites = {};
			var aFavoriteIds, sEntityId;
			if (isArray(mData)) {
				aFavoriteIds = mData;
			} else {
				return;
			}
			for (var entityNo = aFavoriteIds.length; entityNo--;) {
				sEntityId = aFavoriteIds[entityNo];
				oFavorites[sEntityId] = true;
			}
			this._trigger('list_recived', getFavoritesArray.call(this));
		}
		function hOnStatusToggle(bAdded, sEntityId) {
			var oFavorites = this._Favorites;
			if (oFavorites !== null) {
				oFavorites[sEntityId] = bAdded;
			}
			this._trigger('status_toggle', sEntityId, bAdded);
		}
		return {
			_Events: {
				status_toggle: null,
				list_recived: {
					opts: {
						memory: 1
					}
				}
			},
			_Init: function () {
				this._Favorites = null;
				this.getListFromServer();
			},
			getListFromServer: function () {
				return this._Opts.transport('get_list', null).done(hOnGetListData.bind(this));
			},
			isFavEntity: function (sEntityId) {
				var oFavorites = this._Favorites;
				return oFavorites && oFavorites[sEntityId] === true;
			},
			toggleEntityStatus: function (sEntityId, bAdd) {
				//отправляем управляющие запросы, только после того, как получили список
				if (this._Favorites !== null && typeOf(sEntityId, 'string') && sEntityId.length) {
					bAdd = typeOf(bAdd, 'boolean') ? bAdd : !this.isFavEntity(sEntityId);
					return this._Opts.transport('toggle', {
						add: bAdd,
						id: sEntityId
					}).done(hOnStatusToggle.bind(this, bAdd, sEntityId));
				}
			},
			getFavCount: function () {
				var oFavorites = this._Favorites;
				var favCount = 0;
				if (oFavorites !== null) {
					for (var entityId in oFavorites) {
						if (oFavorites.hasOwnProperty(entityId) && oFavorites[entityId] === true) {
							favCount++;
						}
					}
				}
				return favCount;
			}
		};
	}(), 
	/**
	 * @property {function} transport @returns Promise обеспечивает взаимодействие с сервером, принимает тип действия и его параметры
	 */
	{
		transport: null
	}, null, 'Favorites');
	
	oBasic.Extend(window.getNameSpace('Modules', oNS), {
		favoriteEntities: Favorites
	});
}(this, this.ru.mail.cpf));